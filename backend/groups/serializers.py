from rest_framework import serializers
from groups import models
from django.contrib.auth import get_user_model
from django.db.models import Avg
import json

UserModel = get_user_model()

class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        fields = ('id', 'name', 'term', 'year')
        model = models.Course
      
class MembershipSerializer(serializers.ModelSerializer):

    group_name = serializers.ReadOnlyField(source='group_id.name')
    user_display_name = serializers.ReadOnlyField(source='user_id.display_name')
    
    class Meta:
        model = models.Membership
        fields = ('group_id', 'group_name', 'user_id', 'user_display_name', 'user_role',)

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    groups = MembershipSerializer(source='membership_set', many=True)
    display_name = serializers.CharField(required=True)

    # courses = serializers.PrimaryKeyRelatedField(many=True, queryset=models.Course.objects.all())
    courses = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=models.Course.objects.all())

    # courses = CourseSerializer(source='course_set', many=True)


    average_rating = serializers.SerializerMethodField()
    invitations_sent = serializers.SerializerMethodField()
    invitations_received = serializers.SerializerMethodField()
    
    def get_average_rating(self, obj):

        average_rating = models.Rating.objects.all().filter(user=obj.id).aggregate(Avg('rating'))
        if average_rating is None:
            return 0
        return average_rating

    def get_invitations_sent(self, obj):
        print("\n\n\n")
        
        invitations_sent_set = models.Invite.objects.filter(from_user=obj.id)
        print(invitations_sent_set.values())
        invitations_sent_list = list(invitations_sent_set.values('id', 'status', 'to_user', 'group'))
        for i in invitations_sent_list:
            to_user_name = models.CustomUser.objects.filter(id=i["to_user"]).values('display_name')[0]["display_name"]
            group_name = models.Group.objects.filter(id=i["group"]).values('name')[0]["name"]

            i["to_user_name"] = to_user_name
            i["group_name"] = group_name

        print(invitations_sent_list)

        if invitations_sent_list is None:
            return 0
        return invitations_sent_list

    def get_invitations_received(self, obj):

        invitations_received_set = models.Invite.objects.filter(to_user=obj.id)
        invitations_received_list = list(invitations_received_set.values('id', 'from_user', 'group', 'status'))
        for i in invitations_received_list:
            
            if i["status"] != 0:
                invitations_received_list.remove(i)
            else:
                from_user_name = models.CustomUser.objects.filter(id=i["from_user"]).values('display_name')[0]["display_name"]
                group_name = models.Group.objects.filter(id=i["group"]).values('name')[0]["name"]

                i["from_user_name"] = from_user_name
                i["group_name"] = group_name

        if invitations_received_list is None:
            return 0

        return invitations_received_list

    def create(self, validated_data):
        # courses = validated_data['courses']
        courses = validated_data.pop('courses')
        
        user = UserModel.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            display_name=validated_data['display_name'],
        )
        user.set_password(validated_data['password'])
        for c in courses:
            # course_info = models.Course.objects.all().filter(pk=c.id)
            user.courses.add(c)
        user.save()

        return user

    class Meta:
        model = UserModel
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'display_name', 'groups', 'average_rating', 'about_me', 'courses', 'invitations_sent', 'invitations_received',)

class GroupCreateSerializer(serializers.ModelSerializer):

    members = MembershipSerializer(source='membership_set', many=True, required=False)

    def create(self, validated_data):
        user_data = validated_data.pop('membership_set')
        owner = self.context['request'].user
        validated_data['owner'] = owner
        group = models.Group.objects.create(**validated_data)
        for user in user_data:
            d=dict(user)
            models.Membership.objects.create(group_id=group, user_id=d['user_id'], user_role=d['user_role'])
        models.Membership.objects.create(group_id=group, user_id=owner, user_role="owner")

        return group

    def update(self, instance, validated_data):
        user_data = validated_data.pop('membership_set')
        for item in validated_data:
            if models.Group._meta.get_field(item):
                setattr(instance, item, validated_data[item])
        models.Membership.objects.filter(group_id=instance).delete()
        for user in user_data:
            d=dict(user)
            models.Membership.objects.create(group_id=instance, user_id=d['user_id'], user_role=d['user_role'])
        owner = instance.owner
        models.Membership.objects.create(group_id=instance, user_id=owner, user_role="owner")
        instance.save()
        return instance

    class Meta:
        fields = ('id', 'name', 'description', 'members', 'owner',)
        model = models.Group
        # lookup_field = 'course'

class RatingSerializer(serializers.ModelSerializer):

    # user = serializers.SerializerMethodField(source='get_user_id', read_only=True)

    # def get_user_id(self, obj):
    #     return obj.customuser.id
    # user = serializers.ReadOnlyField(source='customuser.id')

    class Meta:
        fields = ('id', 'user', 'rating')
        model = models.Rating

class InviteSerializer(serializers.ModelSerializer):
    
    # from_user_name = serializers.SerializerMethodField()
    # to_user_name = serializers.SerializedMethodField()
    # group_name = serializers.SerializedMethodField()


    # def get_from_user_name(self, obj):
    #     print(obj.from_user.id)
    #     from_user_name = models.CustomUser.objects.get()
    #     print(from_user_name)
    #     return from_user_name

    # def get_to_user_name(self, obj):

    # def get_to_user_name(self, obj):

    from_user_name = serializers.ReadOnlyField(source='from_user.display_name')
    to_user_name = serializers.ReadOnlyField(source='to_user.display_name')
    group_name = serializers.ReadOnlyField(source='group.name')


    class Meta:
        fields = ('id', 'from_user', 'to_user', 'group', 'status', 'from_user_name', 'to_user_name', 'group_name',)
        model=models.Invite

class InviteResponseSerializer(serializers.Serializer):

    response = serializers.BooleanField(required=True)


