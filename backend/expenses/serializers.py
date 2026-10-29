from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    receipt_url = serializers.SerializerMethodField()

    class Meta:
        model = Expense
        fields = (
            "id",
            "description",
            "category",
            "amount",
            "date",
            "receipt",
            "receipt_url",
            "receipt_amount",
            "receipt_verified",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "receipt_url", "created_at", "updated_at")

    def get_receipt_url(self, obj):
        if obj.receipt:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.receipt.url)
            return obj.receipt.url
        return None

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        return value

    def validate(self, attrs):
        amount = attrs.get("amount") or (self.instance.amount if self.instance else None)
        receipt_amount = attrs.get("receipt_amount") if "receipt_amount" in attrs else (self.instance.receipt_amount if self.instance else None)

        if amount is not None and receipt_amount is not None:
            attrs["receipt_verified"] = abs(float(amount) - float(receipt_amount)) < 0.01
        return attrs
