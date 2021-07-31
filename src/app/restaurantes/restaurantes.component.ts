import { RestauranteComponent } from './../restaurante/restaurante.component';
import { NovoRestauranteComponent } from './../novo-restaurante/novo-restaurante.component';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RestaurantesService } from '../shared/restaurantes.service';

@Component({
  selector: 'app-restaurantes',
  templateUrl: './restaurantes.component.html',
  styleUrls: ['./restaurantes.component.scss']
})
export class RestaurantesComponent implements OnInit {

  toSearch: any = '';
  siglas: Array<any> = [];

  restaurantes: Array<any> = [
    // {
    //   nome: "Jurubar",
    //   estado: "Rio de Janeiro",
    //   cidade: "Venda Nova",
    //   descricao: "Muito bom restaurante, tem uma jurupinga batida com jabuticaba divina",
    //   autorRestaurante: "Carioca",
    //   criadoEm: new Date(),
    //   estrelas: 5
    // }, {
    //   nome: "Restaurante da Olivia",
    //   estado: "São Paulo",
    //   cidade: "Jundiai",
    //   descricao: "Muito bom restaurante, tem uma jurupinga batida com jabuticaba divina",
    //   autorRestaurante: "Lucas Santos",
    //   criadoEm: new Date(),
    //   estrelas: 3
    // }, {
    //   nome: "Copacabana Restaurante",
    //   estado: "Rio de Janeiro",
    //   cidade: "Rio de Janeiro",
    //   descricao: "Muito bom restaurante, tem uma jurupinga batida com jabuticaba divina",
    //   autorRestaurante: "Carioca",
    //   criadoEm: new Date(),
    //   estrelas: 5
    // }
  ];

  constructor(
    private _http: HttpClient, private dialog: MatDialog,
    private _restaurantesService: RestaurantesService,
    //instanciei os seviços, apartir dele posso chamar as funções
  ) { }

  ngOnInit(): void {
    //assim que o componente inicia

    //busca os restaurantes no firebase
    this.listarRestaurantes();

    this._http.get('https://servicodados.ibge.gov.br/api/v1/localidades/regioes/1|2|3|4|5/estados').subscribe((res: any) => {
      let estados = res;
      estados = estados.sort((a: any, b: any) => (a.nome > b.nome) ? 1 : -1);
      estados.forEach((estado: any) => {
        this.siglas.push({
          nome: estado.nome,
          sigla: estado.sigla
        })
      })
    })
  }

  async listarRestaurantes() {
    //chamo a listagem do serviço
    //e guardo num array para renderizar no componente com o ngFor
    await this._restaurantesService.listarRestaurantes()
    .subscribe(rests => {
      //o map retorna um novo array
      this.restaurantes = rests.map(rest => rest);

      //com o sort ordeno os restaurantes por ordem de criação para renderizar
      this.restaurantes = this.restaurantes.sort((a, b) => b.criadoEm.seconds - a.criadoEm.seconds);
    });
  }

  novoRestaurante() {
    //abre modal
    //+ envia os dados pro modal
    const dialogRef = this.dialog.open(NovoRestauranteComponent, {
      width: '80%',
      height: 'max-content',
      data: {
        usuario: '',
        siglas: this.siglas
      }
    });

    dialogRef.afterClosed().subscribe((data: any)=>{
      this.restaurantes.push(data);
    })
  }

  sair() {
    console.log('Olá, função sair');
  }

  abrirRestaurante(restaurante: any) {
    //recebe os dados do restaurante
    //abre o modal
    //+ e mostra as informações
    this.dialog.open(RestauranteComponent, {
      width: "80%",
      height: "98vh",
      data: restaurante,
      panelClass: "custom-dialog-container"
    })
  }
}
