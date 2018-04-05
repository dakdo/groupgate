from rest_framework import viewsets, generics, status, mixins
from groups import models
from .serializers import UserSerializer, GroupCreateSerializer, RatingSerializer, InviteResponseSerializer, InviteSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from groups import permissions
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny

from django.http import Http404
from rest_framework.views import APIView
UserModel = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)


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
        course = self.request.query_params.get('course', None)
        if course is not None:
            queryset = queryset.filter(course=course)
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    # @detail_route(methods=['get'])
    # def users_in_class()
    # @detail_route(methods=['patch'])
    # def remove_members_from_group(self, request, pk):
    #     group = self.get_object()
    #     members_to_remove = request.data['members']
    #     group.members.remove(members_to_remove)
    #     return Response(self.serializer_class(group).data)


# class CourseList(generics.ListAPIView):
#     serializer_class = GroupCreateSerializer

#     def get_queryset(self):
#         """
#         This view should return a list of all the purchases for
#         the user as determined by the username portion of the URL.
#         """
#         course = self.kwargs['course']
#         return Purchase.objects.filter(group__course=course)

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
                membership = models.Membership(user=user, group=group, role="member")
                membership.save()
                invite.accept()
                return Response({'success': "Invite accepted"}, status=status.HTTP_200_OK)
            else:
                invite.decline()
                return Response({'success': "Invite declined"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)