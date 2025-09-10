from rest_framework import serializers
from .models import Province, CityMunicipality, Address

class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ['id', 'name']

class CityMunicipalitySerializer(serializers.ModelSerializer):
    province_name = serializers.CharField(source='province.name', read_only=True)
    
    class Meta:
        model = CityMunicipality
        fields = ['id', 'name', 'zip_code', 'province', 'province_name']

class AddressSerializer(serializers.ModelSerializer):
    city_municipality_name = serializers.CharField(source='city_municipality.name', read_only=True)
    province_name = serializers.CharField(source='city_municipality.province.name', read_only=True)
    
    class Meta:
        model = Address
        fields = ['id', 'street', 'barangay', 'city_municipality', 
                 'city_municipality_name', 'province_name']

class AddressCreateSerializer(serializers.Serializer):
    """Serializer for creating addresses with flat structure"""
    street = serializers.CharField(max_length=200)
    barangay = serializers.CharField(max_length=100)
    city_municipality = serializers.CharField(max_length=100)
    province = serializers.CharField(max_length=100)
    zip_code = serializers.CharField(max_length=10, required=False, allow_blank=True)
    
    def create(self, validated_data):
        # Get or create Province
        province, created = Province.objects.get_or_create(
            name=validated_data['province']
        )
        
        # Get or create CityMunicipality
        city_municipality, created = CityMunicipality.objects.get_or_create(
            name=validated_data['city_municipality'],
            province=province,
            defaults={'zip_code': validated_data.get('zip_code', '')}
        )
        
        # Create Address
        address = Address.objects.create(
            street=validated_data['street'],
            barangay=validated_data['barangay'],
            city_municipality=city_municipality
        )
        
        return address