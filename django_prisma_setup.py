#!/usr/bin/env python3
"""
Django + Prisma ORM Setup for Jewellery CRM
This script sets up a hybrid Django + Prisma architecture
"""

import os
import subprocess
import sys

def run_command(command, description):
    """Run a shell command with error handling"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def create_project_structure():
    """Create the Django project structure"""
    
    # Create Django project
    if not run_command("django-admin startproject jewellery_crm", "Creating Django project"):
        return False
    
    os.chdir("jewellery_crm")
    
    # Create Django apps
    apps = [
        "tenants",      # Multi-tenancy
        "customers",    # Customer management
        "sales",        # Sales pipeline
        "appointments", # Appointment system
        "products",     # Product catalog
        "ecommerce",    # Online store
        "analytics",    # Dashboard & reports
        "auth_custom",  # Custom authentication
    ]
    
    for app in apps:
        if not run_command(f"python manage.py startapp {app}", f"Creating {app} app"):
            return False
    
    return True

def setup_prisma():
    """Set up Prisma ORM"""
    
    # Install Prisma
    if not run_command("pip install prisma", "Installing Prisma"):
        return False
    
    # Initialize Prisma
    if not run_command("prisma init", "Initializing Prisma"):
        return False
    
    return True

def create_prisma_schema():
    """Create the Prisma schema for multi-tenant jewellery CRM"""
    
    schema_content = '''// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-py"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Multi-tenant setup
model Tenant {
  id          String   @id @default(cuid())
  name        String
  subdomain   String   @unique
  schemaName  String   @unique @map("schema_name")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // Tenant-specific data
  users       User[]
  stores      Store[]
  customers   Customer[]
  products    Product[]
  orders      Order[]
  appointments Appointment[]
  
  @@map("tenants")
}

// User management with roles
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  firstName   String   @map("first_name")
  lastName    String   @map("last_name")
  phone       String?
  password    String
  role        UserRole
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updatedemis_at")
  
  // Multi-tenant relationship
  tenantId    String   @map("tenant_id")
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // User relationships
  storeId     String?  @map("store_id")
  store       Store?   @relation(fields: [storeId], references: [id])
  
  // User activities
  customers   Customer[]
  appointments Appointment[]
  orders      Order[]
  
  @@map("users")
}

enum UserRole {
  PLATFORM_ADMIN
  BUSINESS_ADMIN
  STORE_MANAGER
  SALES_TEAM
}

// Store management
model Store {
  id          String   @id @default(cuid())
  name        String
  address     String
  phone       String
  email       String?
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // Multi-tenant relationship
  tenantId    String   @map("tenant_id")
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Store relationships
  users        User[]
  customers   Customer[]
  products    Product[]
  orders      Order[]
  
  @@map("stores")
}

// Customer management with jewellery-specific fields
model Customer {
  id          String   @id @default(cuid())
  firstName   String   @map("first_name")
  lastName    String   @map("last_name")
  email       String?
  phone       String
  address     String?
  city        String?
  state       String?
  pincode     String?
  
  // Jewellery preferences
  preferredMetal    MetalType?    @map("preferred_metal")
  stylePreference   StyleType?    @map("style_preference")
  occasion         OccasionType?
  budgetRange      BudgetRange?   @map("budget_range")
  
  // Business info
  gstNumber        String?        @map("gst_number")
  businessName     String?        @map("business_name")
  
  // Customer status
  isActive         Boolean        @default(true) @map("is_active")
  createdAt        DateTime       @default(now()) @map("created_at")
  updatedAt        DateTime       @updatedAt @map("updated_at")
  
  // Multi-tenant relationship
  tenantId         String         @map("tenant_id")
  tenant           Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Store relationship
  storeId          String?        @map("store_id")
 ob store          Store?         @relation(fields: [storeId], references: [id])
  
  // Sales relationship
  assignedToId     String?        @map("assigned_to_id")
  assignedTo       User?          @relation(fields: [assignedToId], references: [id])
  
  // Customer relationships
  appointments     Appointment[]
  orders          Order[]
  leads to         Lead[]
  
  @@map("customers")
}

enum MetalType {
  GOLD
  SILVER
  PLATINUM
  DIAMOND
  PEARL
  GEMSTONE
}

enum StyleType {
  TRADITIONAL
  MODERN
  FUSION
  CONTEMPORARY
  VINTAGE
}

enum OccasionType {
  WEDDING
  ANNIVERSARY
  FESTIVAL
  BIRTHDAY
  GIFT
  PERSONAL
}

enum BudgetRange {
  UNDER_10K
  TEN_TO_25K
  TWENTYFIVE_TO_50K
  FIFTY_TO_1L
  ONE_TO_2L
  ABOVE_2L
}

// Sales pipeline
model Lead {
  id          String   @id @default(cuid())
  title       String
  description String?
  amount      Decimal?
  
  // Lead status
  status      LeadStatus
  priority    Priority
  source      LeadSource
  
  // Lead details
  expectedCloseDate DateTime? @map("expected_close_date")
  notes       String?
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // Relationships
  customerId  String   @map("customer_id")
  customer    Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  
  assignedToId String? @map("assigned_to_id")
  assignedTo   User?   @relation(fields: [assignedToId], references: [id])
  
  tenantId    String   @map("tenant_id")
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@map("leads")
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  PROPOSAL
  NEGOTIATION
  CLOSED_WON
  CLOSED_LOST
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum LeadSource {
  WEBSITE
  REFERRAL
  SOCIAL_MEDIA
  WALK_IN
  PHONE
  WHATSAPP
  OTHER
}

// Appointment system
model Appointment {
  id          String   @id @default(cuid())
  title       String
  description String?
  
  // Appointment details
  startTime   DateTime @map("start_time")
  endTime     DateTime @map("end_time")
  type        AppointmentType
  status      AppointmentStatus
  
  // Location
  location    String?
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // Relationships
  customerId  String   @map("customer_id")
  customer    Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  
  assignedToId String? @map("assigned_to_id")
  assignedTo   User?   @relation(fields: [assignedToId], references: [id])
  
  tenantId    String   @map("tenant_id")
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@map("appointments")
}

enum AppointmentType {
  CONSULTATION
  FITTING
  DELIVERY
  FOLLOW_UP
  OTHER
}

enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

// Product catalog
model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  sku         String   @unique
  
  // Product details
  category    String
  subcategory String?
  metalType   MetalType? @map("metal_type")
  weight      Decimal?
  purity      String?  // 14k, 18k, 22k, etc.
  
  // Pricing
  costPrice   Decimal  @map("cost_price")
  sellingPrice Decimal @map("selling_price")
  
  // Inventory
  stockQuantity Int    @default(0) @map("stock_quantity")
  minStockLevel Int    @default(0) @map("min_stock_level")
  
  // Product status
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // Relationships
  tenantId    String   @map("tenant_id")
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  storeId     String?  @map("store_id")
  store       Store?   @relation(fields: [storeId], references: [id])
  
  // Product relationships
  orderItems  OrderItem[]
  
  @@map("products")
}

// Order management
model Order {
  id          String   @id @default(cuid())
  orderNumber String   @unique @map("order_number")
  
  // Order details
  orderDate   DateTime @default(now()) @map("order_date")
  deliveryDate DateTime? @map("delivery_date")
  
  // Pricing
  subtotal    Decimal
  tax         Decimal
  discount    Decimal @default(0)
  total       Decimal
  
  // Order status
  status      OrderStatus
  paymentStatus PaymentStatus @map("payment_status")
  
  // Customer info
  customerName String @map("customer_name")
  customerPhone String @map("customer_phone")
  customerEmail String? @map("customer_email")
  deliveryAddress String? @map("delivery_address")
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // Relationships
  customerId  String?  @map("customer_id")
  customer    Customer? @relation(fields: [customerId], references: [id])
  
  assignedToId String? @map("assigned_to_id")
  assignedTo   User?   @relation(fields: [assignedToId], references: [id])
  
  tenantId    String   @map("tenant_id")
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  storeId     String?  @map("store_id")
  store       Store?   @relation(fields: [storeId], references: [id])
  
  // Order relationships
  items       OrderItem[]
  
  @@map("orders")
}

model OrderItem {
  id          String   @id @default(cuid())
  quantity    Int
  unitPrice   Decimal  @map("unit_price")
  totalPrice  Decimal  @map("total_price")
  
  // Relationships
  orderId     String   @map("order_id")
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId   String   @map("product_id")
  product     Product  @relation(fields: [productId], references: [id])
  
  @@map("order_items")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  READY_FOR_DELIVERY
  DELIVERED
  CANCELLED
  RETURNED
}

enum PaymentStatus {
  PENDING
  PARTIAL
  PAID
  REFUNDED
}
'''
    
    with open("prisma/schema.prisma", "w") as f:
        f.write(schema_content)
    
    print("✅ Prisma schema created successfully")
    return True

def create_django_settings():
    """Create Django settings with Prisma integration"""
    
    settings_content = '''"""
Django settings for jewellery_crm project.
"""

import os
from pathlib import Path
from prisma import Prisma

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-your-secret-key-here'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'corsheaders',
    'crispy_forms',
    'crispy_tailwind',
    
    # Local apps
    'tenants',
    'customers',
    'sales',
    'appointments',
    'products',
    'ecommerce',
    'analytics',
    'auth_custom',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
    # Custom middleware
    'tenants.middleware.TenantMiddleware',
]

ROOT_URLCONF = 'jewellery_crm.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'jewellery_crm.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'jewellery_crm'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js frontend
    "http://127.0.0.1:3000",
]

# Crispy Forms
CRISPY_ALLOWED_TEMPLATE_PACKS = "tailwind"
CRISPY_TEMPLATE_PACK = "tailwind"

# Prisma client
prisma = Prisma()

# Custom user model
AUTH_USER_MODEL = 'auth_custom.User'

# Login/Logout URLs
LOGIN_URL = '/auth/login/'
LOGIN_REDIRECT_URL = '/dashboard/'
LOGOUT_REDIRECT_URL = '/auth/login/'

# Email settings (for development)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Multi-tenancy settings
TENANT_MODEL = 'tenants.Tenant'
'''
    
    with open("jewellery_crm/settings.py", "w") as f:
        f.write(settings_content)
    
    print("✅ Django settings created successfully")
    return True

def create_requirements():
    """Create requirements.txt file"""
    
    requirements_content = '''# Django
Django==5.0
djangorestframework==3.14.0
django-cors-headers==4.3.1
django-crispy-forms==2.0
crispy-tailwind==0.5.0

# Database
psycopg2-binary==2.9.7
prisma==0.12.0

# Authentication
django-allauth==0.57.0

# Utilities
python-decouple==3.8
Pillow==10.0.1

# Development
django-debug-toolbar==4.2.0
'''
    
    with open("requirements.txt", "w") as f:
        f.write(requirements_content)
    
    print("✅ Requirements.txt created successfully")
    return True

def main():
    """Main setup function"""
    
    print("🚀 Setting up Django + Prisma Jewellery CRM")
    print("=" * 50)
    
    # Step 1: Create project structure
    if not create_project_structure():
        print("❌ Failed to create project structure")
        return
    
    # Step 2: Setup Prisma
    if not setup_prisma():
        print("❌ Failed to setup Prisma")
        return
    
    # Step 3: Create Prisma schema
    if not create_prisma_schema():
        print("❌ Failed to create Prisma schema")
        return
    
    # Step 4: Create Django settings
    if not create_django_settings():
        print("❌ Failed to create Django settings")
        return
    
    # Step 5: Create requirements
    if not create_requirements():
        print("❌ Failed to create requirements")
        return
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Install dependencies: pip install -r requirements.txt")
    print("2. Set up your database")
    print("3. Run: python manage.py migrate")
    print("4. Create superuser: python manage.py createsuperuser")
    print("5. Start development server: python manage.py runserver")

if __name__ == "__main__":
    main() 
 
 