from django.db import models
from django.conf import settings


class Budget(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="budget",
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "budgets"

    def __str__(self):
        return f"{self.user.email} — ₹{self.amount}"
