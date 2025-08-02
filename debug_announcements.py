#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.announcements.models import Announcement
from apps.users.models import User
from apps.stores.models import Store
from apps.tenants.models import Tenant
from django.db.models import Q
from django.utils import timezone

def debug_announcements():
    """Debug announcement filtering issues"""
    
    print("=== Debugging Announcements ===")
    
    # Check users and their stores
    print("\n1. Checking Users and Stores:")
    users = User.objects.all()
    for user in users:
        print(f"User: {user.username} ({user.first_name} {user.last_name})")
        print(f"  - Store: {user.store}")
        print(f"  - Tenant: {user.tenant}")
        print(f"  - Role: {user.role}")
        print()
    
    # Check stores
    print("\n2. Checking Stores:")
    stores = Store.objects.all()
    for store in stores:
        print(f"Store: {store.name} (ID: {store.id})")
        print(f"  - Tenant: {store.tenant}")
        print(f"  - Manager: {store.manager}")
        print()
    
    # Check announcements
    print("\n3. Checking Announcements:")
    announcements = Announcement.objects.all()
    for announcement in announcements:
        print(f"Announcement: {announcement.title}")
        print(f"  - Type: {announcement.announcement_type}")
        print(f"  - Author: {announcement.author} (Store: {announcement.author.store})")
        print(f"  - Tenant: {announcement.tenant}")
        print(f"  - Target Stores: {list(announcement.target_stores.all())}")
        print(f"  - Is Active: {announcement.is_active}")
        print(f"  - Publish At: {announcement.publish_at}")
        print(f"  - Expires At: {announcement.expires_at}")
        print()
    
    # Test filtering for a specific user
    print("\n4. Testing Filtering for First User:")
    if users.exists():
        user = users.first()
        print(f"Testing for user: {user.username}")
        print(f"User store: {user.store}")
        print(f"User tenant: {user.tenant}")
        
        # Base queryset
        queryset = Announcement.objects.filter(is_active=True)
        print(f"Base announcements count: {queryset.count()}")
        
        # Filter by tenant
        if user.tenant:
            queryset = queryset.filter(tenant=user.tenant)
            print(f"After tenant filter: {queryset.count()}")
        
        # Filter by store
        if user.store:
            store_filtered = queryset.filter(
                Q(target_stores__isnull=True) |  # System-wide
                Q(target_stores=user.store) |    # Store-specific
                Q(author__store=user.store)      # Created by same store members
            ).distinct()
            print(f"After store filter: {store_filtered.count()}")
            
            # Show which announcements are included
            print("Included announcements:")
            for ann in store_filtered:
                print(f"  - {ann.title} (Type: {ann.announcement_type}, Author Store: {ann.author.store})")
        
        # Filter by publish date
        now = timezone.now()
        final_queryset = store_filtered.filter(
            Q(publish_at__lte=now) &
            (Q(expires_at__isnull=True) | Q(expires_at__gt=now))
        )
        print(f"After date filter: {final_queryset.count()}")
        
        print("Final announcements:")
        for ann in final_queryset:
            print(f"  - {ann.title}")

if __name__ == "__main__":
    debug_announcements() 