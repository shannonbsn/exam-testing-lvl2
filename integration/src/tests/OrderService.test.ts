import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../OrderService';
import { ICustomer, IProduct, IOrderItem } from '../types';

describe('Intégration - OrderService', () => {
    let orderService: OrderService;
    let mockDataStore: any;
    let mockProductService: any;
    let mockCustomerService: any;

    beforeEach(() => {
        const fakeCustomer: ICustomer = {
            id: 'cust1',
            name: 'Alice',
            email: 'alice@example.com',
            address: '123 Rue Principale',
            phone: '0102030405',
            loyaltyPoints: 0
        };

        const fakeProduct: IProduct = {
            id: 'prod1',
            name: 'Pizza 4 fromages',
            description: 'Fromage fondant',
            price: 15,
            category: 'main',
            available: true,
            preparationTimeMinutes: 20
        };

        mockDataStore = {
            saveOrder: vi.fn(),
            getOrder: vi.fn(),
            getCustomerOrders: vi.fn()
        };

        mockProductService = {
            getProduct: vi.fn(() => fakeProduct)
        };

        mockCustomerService = {
            getCustomer: vi.fn(() => fakeCustomer),
            addLoyaltyPoints: vi.fn()
        };

        orderService = new OrderService(mockDataStore, mockProductService, mockCustomerService);
    });

    it('crée une commande valide avec un client et un produit disponibles', () => {
        const order = orderService.createOrder('cust1', [
            { productId: 'prod1', quantity: 2 }
        ]);

        expect(order).not.toBeNull();
        expect(order?.items.length).toBe(1);
        expect(order?.totalAmount).toBe(30);
        expect(order?.status).toBe('pending');

        expect(mockDataStore.saveOrder).toHaveBeenCalledOnce();
        expect(mockCustomerService.addLoyaltyPoints).toHaveBeenCalledWith('cust1', 3);
    });
});