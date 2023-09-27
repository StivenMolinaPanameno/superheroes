import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirnDialogComponent } from '../../components/confirn-dialog/confirn-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit{
  public heroForm =   new FormGroup({
    id:               new FormControl(''),
    superhero:        new FormControl('', {nonNullable:true}),
    publisher:        new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl(''),
  });

  public publishers = [
    {id: 'DC Comics', value: 'DC - Comics'},
    {id: 'Marvel Comics', value: 'Marvel - Comics'}
  ];

  constructor(private heroesService:HeroesService,
    private activateRoute:ActivatedRoute,
    private router:Router,
    private snackBar:MatSnackBar,
    private dialog:MatDialog ){}


  get currentHero():Hero{
    const  hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if(!this.router.url.includes('edit')) return;
    this.activateRoute.params.pipe(
      switchMap(({id})=> this.heroesService.getHeroeById(id)),

    ).subscribe(hero=>{
      if(!hero) return this.router.navigateByUrl('/');
      this.heroForm.reset(hero)
      return;
    })
  }
  onSubmit():void{
    if(this.heroForm.invalid) return;

    if(this.currentHero.id){
      this.heroesService.update(this.currentHero)
      .subscribe(hero => {
        this.showSnackBar(`${hero.superhero} updated`)
      })
      return;
    }
    this.heroesService.addHero(this.currentHero)
    .subscribe(hero=>{
      this.router.navigate(['heroes/edit/', hero.id]),
      this.showSnackBar(`${hero.superhero} created`)
    })
  }


  onDeleteHero(){
    if(!this.currentHero.id) throw Error('Hero required');
    const dialogRef = this.dialog.open(ConfirnDialogComponent, {
    data: this.heroForm.value
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if(!result) return;
    //   this.heroesService.deleteHeroById(this.currentHero.id).subscribe(
    //     wasDeleted=>{
    //       if(wasDeleted)  this.router.navigateByUrl('/heroes')
    //     }
    //   );
    // });

    dialogRef.afterClosed()
    .pipe(
      filter((result:boolean)=>result),
      switchMap(()=>this.heroesService.deleteHeroById(this.currentHero.id)),
      filter((wasDeleted:boolean)=>wasDeleted)
    )
    .subscribe(() =>{
      this.router.navigateByUrl('/heroes');
    })

  }

  showSnackBar(message:string):void{
    this.snackBar.open(message, 'done', {duration:2500})
  }
}
