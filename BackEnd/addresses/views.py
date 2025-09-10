from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Province, CityMunicipality, Address
from .serializers import ProvinceSerializer, CityMunicipalitySerializer, AddressSerializer

class LocationDataView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get provinces and their cities for form dropdowns"""
        provinces = Province.objects.prefetch_related('citymunicipality_set').all()
        
        data = []
        for province in provinces:
            cities = [
                {
                    'id': city.id,
                    'name': city.name,
                    'zip_code': city.zip_code
                }
                for city in province.citymunicipality_set.all()
            ]
            
            data.append({
                'id': province.id,
                'name': province.name,
                'cities': cities
            })
        
        return Response(data, status=status.HTTP_200_OK)

class ProvinceListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        provinces = Province.objects.all()
        serializer = ProvinceSerializer(provinces, many=True)
        return Response(serializer.data)

class CityMunicipalityListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        province_id = request.query_params.get('province_id')
        if province_id:
            cities = CityMunicipality.objects.filter(province_id=province_id)
        else:
            cities = CityMunicipality.objects.all()
        
        serializer = CityMunicipalitySerializer(cities, many=True)
        return Response(serializer.data)