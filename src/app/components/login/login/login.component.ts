import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApirestService } from 'src/app/services/apirest/apirest.service';
import * as forge from 'node-forge';
import { CookieService } from 'ngx-cookie-service';
import { utf8Encode } from '@angular/compiler/src/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private service: ApirestService,private cookieService:CookieService) { }

  ngOnInit(): void {
    this.conectarServidor()
  }

  conectarServidor(){
    if (!this.cookieService.check("sessionid")){
      let keys = forge.pki.rsa.generateKeyPair()
      this.cookieService.set("private",btoa(forge.pki.privateKeyToPem(keys.privateKey)),{path:"/"})
      this.cookieService.set("public",btoa(forge.pki.publicKeyToPem(keys.publicKey)),{path:"/"})
    

      this.service.get("http://localhost:8000/api/auth/connect/"+this.cookieService.get("public")).subscribe(res=>{
        
      let private_key = forge.pki.privateKeyFromPem(atob(this.cookieService.get("private")))
      let key = private_key.decrypt(atob(res),'RSA-OAEP', {md: forge.md.sha256.create()})

      this.cookieService.set("key",btoa(key),{path:"/"})
      alert("")
      this.login()

      },err=>{
        alert(err.error.error)
      })
    }
    else{
      this.login()
    }
  }

  login(){
    this.service.get("http://localhost:8000/api/auth/login/").subscribe(res=>{
      window.location.replace(res)
    },err=>{

    })
  }

}
