from rest_framework import serializers
from groups import models
from django.contrib.auth import get_user_model
from django.db.models import Avg

UserModel = get_user_model()

class MembershipSerializer(serializers.ModelSerializer):
    group_id = serializers.ReadOnlyField(source='group.id')
    group_name = serializers.ReadOnlyField(source='group.name')
    user_id = serializers.ReadOnlyField(source='customuser.id')
    user_name = serializers.ReadOnlyField(source='customuser.first_name')
    class Meta:
        model = models.Membership
        fields = ('group_id', 'group_name', 'user_id', 'user_name', 'user', 'role',)

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    groups = MembershipSerializer(source='membership_set', many=True)
    display_name = serializers.CharField(required=False)

    average_rating = serializers.SerializerMethodField()
    
    def get_average_rating(self, obj):
        print("\n\n\n")
        # print(models.Rating.objects.filter(user=obj.id)).all().aggregate(Avg('rating'))
        print(obj.id)
        print("\n\n\n")
        # average_rating = models.Rating.objects.filter(user=obj.id).aggregate(Avg('rating')).get('rating__rating')
        # average_rating = models.Rating.objects.all().aggregate(Avg('rating'))
        average_rating = models.Rating.objects.all().filter(user=obj.id).aggregate(Avg('rating'))
        if average_rating is None:
            return 0
        return average_rating

    def create(self, validated_data):

        user = UserModel.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user

    class Meta:
        model = UserModel
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'display_name', 'groups', 'average_rating')

class GroupCreateSerializer(serializers.ModelSerializer):
    members = MembershipSerializer(source='membership_set', many=True, required=False)
    def create(self, validated_data):
        user_data = validated_data.pop('membership_set')
        validated_data['owner'] = self.context['request'].user
        group = models.Group.objects.create(**validated_data)
        for user in user_data:
            d=dict(user)
            models.Membership.objects.create(group=group, user=d['user'], role=d['role'])
        return group

    def update(self, instance, validated_data):
        user_data = validated_data.pop('membership_set')
        for item in validated_data:
            if models.Group._meta.get_field(item):
                setattr(instance, item, validated_data[item])
        models.Membership.objects.filter(group=instance).delete()
        for user in user_data:
            d=dict(user)
            models.Membership.objects.create(group=instance, user=d['user'], role=d['role'])
        instance.save()
        return instance

    class Meta:
        fields = ('id', 'name', 'course', 'description', 'members', 'owner',)
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

class WeddingInviteSerializer(serializers.ModelSerializer):
    # group = serializers.ReadOnlyField(source='group.id')
    # from_user = serializers.ReadOnlyField(source='customuser.id')
    # to_user = serializers.ReadOnlyField(source='customuser.id')

    # from_user = UserSerializer(source='customuser.person_inviting')
    # to_user = UserSerializer(source='customuser.person_invited')
    class Meta:
        fields = ('id', 'from_user', 'to_user', 'group', 'status')
        model=models.WeddingInvite

class WeddingInviteResponseSerializer(serializers.Serializer):
    response = serializers.BooleanField(required=True)
