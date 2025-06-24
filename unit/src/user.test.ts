import { describe, it, expect, beforeEach } from 'vitest';
import { User } from './User';
import { UserCategory } from './types';

describe('User', () => {
    let user: User;

    beforeEach(() => {
        user = new User('1', 'Alice', 'alice@example.com');
    });

    it('initialise correctement les propriétés', () => {
        expect(user.id).toBe('1');
        expect(user.name).toBe('Alice');
        expect(user.email).toBe('alice@example.com');
        expect(user.category).toBe('standard');
        expect(user.currentLoans).toEqual([]);
    });

    it('peut emprunter si en dessous de la limite', () => {
        user.currentLoans = ['book1', 'book2'];
        expect(user.canBorrow()).toBe(true);
    });

    it('ne peut pas emprunter au-dessus de la limite', () => {
        user.currentLoans = ['book1', 'book2', 'book3'];
        expect(user.canBorrow()).toBe(false);
    });

    it('ajoute un emprunt si non existant', () => {
        user.addLoan('book1');
        expect(user.currentLoans).toContain('book1');
    });

    it('n’ajoute pas un emprunt déjà présent', () => {
        user.addLoan('book1');
        user.addLoan('book1');
        expect(user.currentLoans).toEqual(['book1']);
    });

    it('retire un emprunt', () => {
        user.addLoan('book1');
        user.removeLoan('book1');
        expect(user.currentLoans).not.toContain('book1');
    });

    it('gère les catégories avec des plafonds différents', () => {
        const employee = new User('2', 'Bob', 'bob@example.com', 'employee');
        employee.currentLoans = Array(7).fill('book');
        expect(employee.canBorrow()).toBe(true);
        employee.currentLoans.push('book8');
        expect(employee.canBorrow()).toBe(false);
    });
});
