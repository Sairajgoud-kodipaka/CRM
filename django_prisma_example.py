"""
Django + Prisma Integration Examples
This shows how to use Prisma ORM within Django views
"""

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib import messages
from prisma import Prisma
import json

# Initialize Prisma client
prisma = Prisma()

class PrismaService:
    """Service class to handle Prisma operations"""
    
    def __init__(self):
        self.prisma = Prisma()
        self.prisma.connect()
    
    def __del__(self):
        self.prisma.disconnect()
    
    def get_tenant_by_subdomain(self, subdomain):
        """Get tenant by subdomain"""
        return self.prisma.tenant.find_unique(
            where={"subdomain": subdomain}
        )
    
    def get_customers_by_tenant(self, tenant_id, limit=20, offset=0):
        """Get customers for a specific tenant"""
        return self.prisma.customer.find_many(
            where={"tenantId": tenant_id},
            take=limit,
            skip=offset,
            include={
                "store": True,
                "assignedTo": True,
                "orders": {
                    "take": 5,
                    "order": {"createdAt": "desc"}
                }
            }
        )
    
    def create_customer(self, tenant_id, customer_data):
        """Create a new customer"""
        return self.prisma.customer.create(
            data={
                "firstName": customer_data["firstName"],
                "lastName": customer_data["lastName"],
                "email": customer_data.get("email"),
                "phone": customer_data["phone"],
                "address": customer_data.get("address"),
                "city": customer_data.get("city"),
                "state": customer_data.get("state"),
                "pincode": customer_data.get("pincode"),
                "preferredMetal": customer_data.get("preferredMetal"),
                "stylePreference": customer_data.get("stylePreference"),
                "occasion": customer_data.get("occasion"),
                "budgetRange": customer_data.get("budgetRange"),
                "gstNumber": customer_data.get("gstNumber"),
                "businessName": customer_data.get("businessName"),
                "tenantId": tenant_id,
                "storeId": customer_data.get("storeId"),
                "assignedToId": customer_data.get("assignedToId"),
            }
        )
    
    def get_sales_pipeline(self, tenant_id):
        """Get sales pipeline data for dashboard"""
        return self.prisma.lead.group_by(
            by=["status"],
            where={"tenantId": tenant_id},
            _count={"id": True},
            _sum={"amount": True}
        )
    
    def get_revenue_metrics(self, tenant_id):
        """Get revenue metrics for dashboard"""
        return self.prisma.order.aggregate(
            where={
                "tenantId": tenant_id,
                "status": "DELIVERED"
            },
            _sum={"total": True},
            _count={"id": True}
        )

# Django Views using Prisma

@login_required
def dashboard_view(request):
    """Dashboard view with Prisma data"""
    try:
        # Get current tenant (from middleware or session)
        tenant_id = request.session.get('tenant_id')
        
        prisma_service = PrismaService()
        
        # Get dashboard metrics
        pipeline_data = prisma_service.get_sales_pipeline(tenant_id)
        revenue_data = prisma_service.get_revenue_metrics(tenant_id)
        
        # Get recent customers
        recent_customers = prisma_service.get_customers_by_tenant(
            tenant_id, limit=5
        )
        
        context = {
            'pipeline_data': pipeline_data,
            'revenue_data': revenue_data,
            'recent_customers': recent_customers,
        }
        
        return render(request, 'dashboard/index.html', context)
        
    except Exception as e:
        messages.error(request, f"Error loading dashboard: {str(e)}")
        return render(request, 'dashboard/index.html', {})

@login_required
def customer_list_view(request):
    """Customer list view with Prisma"""
    try:
        tenant_id = request.session.get('tenant_id')
        page = int(request.GET.get('page', 1))
        limit = 20
        offset = (page - 1) * limit
        
        prisma_service = PrismaService()
        
        # Get customers with pagination
        customers = prisma_service.get_customers_by_tenant(
            tenant_id, limit=limit, offset=offset
        )
        
        # Get total count for pagination
        total_customers = prisma_service.prisma.customer.count(
            where={"tenantId": tenant_id}
        )
        
        context = {
            'customers': customers,
            'current_page': page,
            'total_pages': (total_customers + limit - 1) // limit,
            'total_customers': total_customers,
        }
        
        return render(request, 'customers/customer_list.html', context)
        
    except Exception as e:
        messages.error(request, f"Error loading customers: {str(e)}")
        return render(request, 'customers/customer_list.html', {})

@login_required
@require_http_methods(["GET", "POST"])
def customer_create_view(request):
    """Create new customer view"""
    if request.method == "POST":
        try:
            tenant_id = request.session.get('tenant_id')
            
            # Get form data
            customer_data = {
                "firstName": request.POST.get("firstName"),
                "lastName": request.POST.get("lastName"),
                "email": request.POST.get("email"),
                "phone": request.POST.get("phone"),
                "address": request.POST.get("address"),
                "city": request.POST.get("city"),
                "state": request.POST.get("state"),
                "pincode": request.POST.get("pincode"),
                "preferredMetal": request.POST.get("preferredMetal"),
                "stylePreference": request.POST.get("stylePreference"),
                "occasion": request.POST.get("occasion"),
                "budgetRange": request.POST.get("budgetRange"),
                "gstNumber": request.POST.get("gstNumber"),
                "businessName": request.POST.get("businessName"),
                "storeId": request.POST.get("storeId"),
                "assignedToId": request.POST.get("assignedToId"),
            }
            
            prisma_service = PrismaService()
            new_customer = prisma_service.create_customer(tenant_id, customer_data)
            
            messages.success(request, f"Customer {new_customer.firstName} {new_customer.lastName} created successfully!")
            return redirect('customer_list')
            
        except Exception as e:
            messages.error(request, f"Error creating customer: {str(e)}")
    
    return render(request, 'customers/customer_create.html')

@login_required
def customer_detail_view(request, customer_id):
    """Customer detail view"""
    try:
        tenant_id = request.session.get('tenant_id')
        
        prisma_service = PrismaService()
        
        # Get customer with all related data
        customer = prisma_service.prisma.customer.find_unique(
            where={"id": customer_id},
            include={
                "store": True,
                "assignedTo": True,
                "appointments": {
                    "order": {"startTime": "desc"},
                    "take": 10
                },
                "orders": {
                    "order": {"orderDate": "desc"},
                    "take": 10
                },
                "leads": {
                    "order": {"createdAt": "desc"},
                    "take": 10
                }
            }
        )
        
        if not customer or customer.tenantId != tenant_id:
            messages.error(request, "Customer not found")
            return redirect('customer_list')
        
        context = {
            'customer': customer,
        }
        
        return render(request, 'customers/customer_detail.html', context)
        
    except Exception as e:
        messages.error(request, f"Error loading customer: {str(e)}")
        return redirect('customer_list')

# API Views for AJAX requests

@login_required
def api_customers(request):
    """API endpoint for customers data"""
    try:
        tenant_id = request.session.get('tenant_id')
        page = int(request.GET.get('page', 1))
        limit = 20
        offset = (page - 1) * limit
        
        prisma_service = PrismaService()
        
        customers = prisma_service.get_customers_by_tenant(
            tenant_id, limit=limit, offset=offset
        )
        
        # Convert to JSON-serializable format
        customers_data = []
        for customer in customers:
            customers_data.append({
                'id': customer.id,
                'firstName': customer.firstName,
                'lastName': customer.lastName,
                'email': customer.email,
                'phone': customer.phone,
                'preferredMetal': customer.preferredMetal,
                'stylePreference': customer.stylePreference,
                'budgetRange': customer.budgetRange,
                'createdAt': customer.createdAt.isoformat(),
                'store': customer.store.name if customer.store else None,
                'assignedTo': f"{customer.assignedTo.firstName} {customer.assignedTo.lastName}" if customer.assignedTo else None,
            })
        
        return JsonResponse({
            'customers': customers_data,
            'page': page,
            'has_next': len(customers_data) == limit
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
def api_dashboard_metrics(request):
    """API endpoint for dashboard metrics"""
    try:
        tenant_id = request.session.get('tenant_id')
        
        prisma_service = PrismaService()
        
        # Get pipeline data
        pipeline_data = prisma_service.get_sales_pipeline(tenant_id)
        
        # Get revenue data
        revenue_data = prisma_service.get_revenue_metrics(tenant_id)
        
        # Get recent customers count
        recent_customers_count = prisma_service.prisma.customer.count(
            where={
                "tenantId": tenant_id,
                "createdAt": {
                    "gte": "2024-01-01T00:00:00Z"  # This month
                }
            }
        )
        
        return JsonResponse({
            'pipeline': pipeline_data,
            'revenue': {
                'total': float(revenue_data._sum.total or 0),
                'count': revenue_data._count.id
            },
            'new_customers': recent_customers_count
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Admin Panel Integration

def admin_customer_list(request):
    """Admin panel customer list"""
    try:
        tenant_id = request.session.get('tenant_id')
        
        prisma_service = PrismaService()
        
        # Get all customers for admin
        customers = prisma_service.prisma.customer.find_many(
            where={"tenantId": tenant_id},
            include={
                "store": True,
                "assignedTo": True,
                "orders": {
                    "_count": True
                }
            },
            order={"createdAt": "desc"}
        )
        
        context = {
            'customers': customers,
        }
        
        return render(request, 'admin/customer_list.html', context)
        
    except Exception as e:
        messages.error(request, f"Error loading admin data: {str(e)}")
        return render(request, 'admin/customer_list.html', {})

# Template Context Processors

def tenant_context(request):
    """Add tenant info to all templates"""
    try:
        tenant_id = request.session.get('tenant_id')
        if tenant_id:
            prisma_service = PrismaService()
            tenant = prisma_service.prisma.tenant.find_unique(
                where={"id": tenant_id}
            )
            return {'current_tenant': tenant}
    except:
        pass
    return {}

# Middleware for tenant identification

class TenantMiddleware:
    """Middleware to identify tenant from subdomain"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Extract subdomain from request
        host = request.get_host()
        subdomain = host.split('.')[0] if '.' in host else None
        
        if subdomain and subdomain != 'www':
            try:
                prisma_service = PrismaService()
                tenant = prisma_service.get_tenant_by_subdomain(subdomain)
                
                if tenant:
                    request.session['tenant_id'] = tenant.id
                    request.session['tenant_name'] = tenant.name
                else:
                    # Handle invalid tenant
                    if not request.path.startswith('/auth/'):
                        return redirect('/auth/login/')
                        
            except Exception as e:
                print(f"Tenant middleware error: {e}")
        
        response = self.get_response(request)
        return response 
 
 