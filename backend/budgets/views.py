from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Budget
from .serializers import BudgetSerializer


class BudgetView(APIView):
    """GET returns current budget (0 if not set). PUT/PATCH sets or updates it."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            budget = Budget.objects.get(user=request.user)
            return Response(BudgetSerializer(budget).data)
        except Budget.DoesNotExist:
            return Response({"amount": "0.00", "updated_at": None})

    def put(self, request):
        return self._save(request)

    def patch(self, request):
        return self._save(request)

    def _save(self, request):
        budget, created = Budget.objects.get_or_create(user=request.user, defaults={"amount": 0})
        serializer = BudgetSerializer(budget, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
