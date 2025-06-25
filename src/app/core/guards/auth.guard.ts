import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

 canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree {
  const token = localStorage.getItem('token');
  console.log('AuthGuard: token =', token);

  if (!token) {
    console.log('AuthGuard: não autenticado, indo pro login');
    return this.router.parseUrl('/login');
  }
  console.log('AuthGuard: autenticado');
  return true;
}

}
