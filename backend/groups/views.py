from rest_framework import viewsets, generics, status, mixins
from groups import models
from .serializers import UserSerializer, GroupCreateSerializer, RatingSerializer, InviteResponseSerializer, InviteSerializer, CourseSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from groups import permissions
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django_filters import rest_framework as filters
from django.http import Http404
from rest_framework.views import APIView
UserModel = get_user_model()

class CourseFilter(filters.FilterSet):
    class Meta:
        model = models.Course
        fields = ('name', 'term', 'year')

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):

        queryset = models.CustomUser.objects.all()
        course = self.request.query_params.get('course', None)
        if course is not None:
            queryset = queryset.filter(courses__in=course)
        return queryset


class GroupViewSet(viewsets.ModelViewSet):
    queryset = models.Group.objects.all()
    serializer_class = GroupCreateSerializer

    permission_classes = (IsAuthenticated, permissions.IsOwnerOrReadOnly,)

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = models.Group.objects.all()
        owner = self.request.query_params.get('owner', None)
        if owner is not None:
            queryset = queryset.filter(owner=owner)
        return queryset

class RatingViewSet(viewsets.ModelViewSet):
    queryset = models.Rating.objects.all()
    serializer_class = RatingSerializer

class InviteView(mixins.CreateModelMixin,
                 mixins.RetrieveModelMixin,
                 mixins.DestroyModelMixin,
                 mixins.ListModelMixin,
                 viewsets.GenericViewSet):
    queryset = models.Invite.objects.all()
    serializer_class = InviteSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = models.Invite.objects.all()
        from_user = self.request.query_params.get('from_user', None)
        if from_user is not None:
            queryset = queryset.filter(from_user=from_user)
        
        to_user = self.request.query_params.get('to_user', None)
        if to_user is not None:
            queryset = queryset.filter(to_user=to_user)
        return queryset

class InviteResponseView(APIView):
    serializer_class = InviteResponseSerializer

    def get_invite(self, pk):
        try:
            return models.Invite.objects.get(pk=pk)
        except models.Invite.DoesNotExist:
            raise Http404

    def get_group(self, pk):
        try:
            return models.Group.objects.get(pk=pk)
        except models.Group.DoesNotExist:
            raise Http404

    def get_user(self, pk):
        try:
            return models.CustomUser.objects.get(pk=pk)
        except models.CustomUser.DoesNotExist:
            raise Http404

    def post(self, request, pk):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            response = serializer.data['response']
            invite = self.get_invite(pk)
            group = self.get_group(invite.group.id)
            user = self.get_user(invite.to_user.id)

            if response == True:
                membership = models.Membership(user_id=user, group_id=group, user_role="member")
                membership.save()
                invite.accept()
                return Response({'success': "Invite accepted"}, status=status.HTTP_200_OK)
            else:
                invite.decline()
                return Response({'success': "Invite declined"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = models.Course.objects.all()
    serializer_class = CourseSerializer
    filter_class = CourseFilter
