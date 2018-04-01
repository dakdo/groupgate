from django.urls import path
from .views import UserViewSet, GroupViewSet, RatingViewSet, WeddingInviteView, WeddingInviteResponseView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('users', UserViewSet, base_name='users')
router.register('groups', GroupViewSet, base_name='groups')
router.register('ratings', RatingViewSet, base_name='ratings')
router.register('invites', WeddingInviteView, base_name="invites")

urlpatterns = [
    #  path('groups/course/<str:course>/', CourseList),
    path('invite/<int:pk>/response/', WeddingInviteResponseView.as_view(), name='wedding-invite-response'),
]

urlpatterns += router.urls