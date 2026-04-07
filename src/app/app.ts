import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // Añade ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { PokemonService } from './services/pokemon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  pokemonService = inject(PokemonService);
  cdr = inject(ChangeDetectorRef); // Inyectamos el detector de cambios
  pokemons: any[] = [];

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokemonService.getPokemons(151).subscribe({
      next: (response: any) => {
        response.results.forEach((poke: any) => {
          this.pokemonService.getPokemonDetails(poke.name).subscribe({
            next: (details: any) => {
              this.pokemons.push(details);
              this.pokemons.sort((a, b) => a.id - b.id);
              
              // ESTO ES LO IMPORTANTE:
              // Avisamos a Angular que la lista cambió para que la dibuje
              this.cdr.detectChanges(); 
            }
          });
        });
      }
    });
  }
}