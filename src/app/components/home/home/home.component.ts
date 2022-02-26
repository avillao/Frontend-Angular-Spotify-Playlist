import { Component, OnInit } from '@angular/core';
import { ApirestService } from 'src/app/services/apirest/apirest.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tracks_list:any[] = []
  word:string = ""

  constructor(private http: ApirestService, private cookieService: CookieService, private router:Router) { }

  ngOnInit(): void {
  }

  async buscarPalabraInicial(value:string){
    this.word = value
    let navbar:any = document.getElementById('search-container') as HTMLDivElement
    let content:HTMLDivElement = document.getElementById('playlist-container') as HTMLDivElement
    let container:any = document.querySelector("#playlist-container > div > div:last-child") as HTMLDivElement
    let btn  = content.firstChild?.firstChild as HTMLDivElement
    
    if(!btn.classList.contains("d-none")){
      btn.classList.toggle("d-none")
    }

    navbar.classList.add('navbar-active')
    content.classList.add('vh-80')
    container.innerHTML = ''
    let token = <string> await this.getToken()
    console.log(token)

    if(token){
      console.log("segunda peticion")
      console.log(token)
      this.http.get("http://localhost:8000/api/initTrack/search?word="+value+"&token="+token).subscribe(res=>{
        container.classList.add('p-4')
        this.tracks_list = res.tracks

        for(let i = 0; i<this.tracks_list.length;i++){
          
          container.innerHTML +=
          `
          <div class="row align-items-center">
            <span class="col-1 text-center letter-label">${value.trim()[i].toUpperCase()}</span>
            <iframe class="col-11" src="https://open.spotify.com/embed/track/${this.tracks_list[i]}?utm_source=generator"
            width="100%" height="80" frameBorder="0" allowfullscreen="" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
            </iframe>
          </div>
          ` 
        }
        btn.classList.toggle("d-none")
        
      },err=>{
        console.log(err)
      })

    }else{
      alert("sin token")
      this.router.navigate([""])
    }
    
  }

  getToken(){

    if(this.cookieService.check("AccessToken")){
      return new Promise((resolve) =>{
        resolve(this.cookieService.get("AccessToken"))
      })

    }else{

      if(this.cookieService.check("RefreshToken")){
        let refreshToken = this.cookieService.get("RefreshToken")
        return new Promise((resolve,reject)=>{
          this.http.get("http://localhost:8000/api/auth/refreshToken?token="+refreshToken).subscribe(()=>{
            console.log("primera peticion")
            resolve(this.cookieService.get("AccessToken"))
          },err=>{
            alert("Ocurrió un error")
            reject(null)
          })
        })

      }else{
        return null
      }
      
    }
  }

  crearPlaylist(){
    this.http.post("http://localhost:8000/api/playlist/create",{word:this.word,tracks:this.tracks_list}).subscribe(res=>{
      alert(res.msg)
    },err=>{
      console.log(err.error.error)
    })
  }
}
