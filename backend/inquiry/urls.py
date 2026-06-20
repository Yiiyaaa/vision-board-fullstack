from django.urls import path
from . import views

urlpatterns = [
    path('inquiries/', views.InquiryCreateView.as_view(), name='inquiry-create'),
]
