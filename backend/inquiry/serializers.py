from rest_framework import serializers
from .models import Inquiry


class InquirySerializer(serializers.ModelSerializer):
    # honeypot: real users never see or fill this; automated bots usually do.
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = Inquiry
        fields = ['id', 'name', 'contact', 'subject', 'content', 'source', 'status', 'created_at', 'website']
        read_only_fields = ['id', 'status', 'created_at']

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('请填写反馈内容')
        return value.strip()

    def validate(self, attrs):
        # honeypot tripped → reject as spam
        if attrs.get('website'):
            raise serializers.ValidationError({'detail': 'spam detected'})
        attrs.pop('website', None)
        return attrs
