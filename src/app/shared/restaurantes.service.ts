import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RestaurantesService {

  private basePath = '/restaurantes';

  //recebo
  constructor(
    private _fireStore: AngularFirestore,
    //cria os restaurantes
    private _fireStorage: AngularFireStorage
    //o storage servirá para o upload de imagens
  ) {  }

  criaRestaurante(avaliacao: any, fileUpload: any) {
    //recebe avaliação e a foto

    //restaurantes recebe a coleção de restaurantes
    //entro na firestore (onde crio os restaurantes)
    //a coleção de restaurants, possui restaurantes
    const restaurantes = this._fireStore.collection('restaurantes');

    //na coleção de restaurantes, faço um .add
    //adicionando uma avaliação
    //+ a url de download da foto (hospedada na storage do firebase)
    //essa base url da foto, utilizaremos no src na view
    restaurantes.add({...avaliacao, downloadUrl: fileUpload}).then(doc => doc.update({ id: doc.id }));

    //então, é retornado um doc
    //doc é o documento onde salvei o restaurante
    //e nesse documento (restaurante), salvo um id
    //esse doc id o próprio firebase gera, apenas salvo dentro do restaurante para ele ter uma identificação
  }

  listarRestaurantes() {
    //retorna a coleção de restaurantes

    //acesso a coleção de restaurantes
    //e com o valueChanges "avisa" no componente cada vez que um documento é alterado/adicionado na coleção 
    return this._fireStore.collection('restaurantes').valueChanges();
  }

  pushFileToStorage(avaliacao: any, fileUpload: any) {
    //recebe avaliação e a foto

    //filePath: caminho do arquivo
    const filePath = `${this.basePath}/${fileUpload.name}_${avaliacao.nome}_${new Date()}`;

    //cria uma referencia no storage
    const storageRef = this._fireStorage.ref(filePath);

    //faz o upload de fato no storage do firebase
    //upload pede o caminho e o arquivo
    const uploadTask = this._fireStorage.upload(filePath, fileUpload);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        //pelo o download url
        //subscribe: retorna algo para fazer uma ação, retornou o proprio downloadURL
        storageRef.getDownloadURL().subscribe(downloadURL => {
          //salva essa url no fileUpload
          fileUpload.url = downloadURL;

          //e passo esse fileUpload para o criaRestaurante para subir na firestore apenas a avaliação e a url da foto
          this.criaRestaurante(avaliacao, fileUpload.url);
        });
      })
    ).subscribe();
  }

  criaComentarioDousuario(idRestaurante: string, idUsuario: string, avaliacao: object) {
    //recebe o id do restaurante
    //+ o id do usuário
    //+ avaliação

    //entra na coleção de restaurantes
    //no documento específico do restaurante pelo id
    //pego a coleção de avaliações desse restaurante
    //e dentro da coleção de avaliações acesso o documento do usuario (pelo id dele) e salvo a avaliação do usuario em questão
    return this._fireStore.collection('restaurantes')
    .doc(idRestaurante).collection('avaliações').doc(idUsuario).set(avaliacao);
  }

  listaComentariosDoRestaurante(idRestaurante: string) {
    //recebe o id do restaurante

    //entro na coleção de restaurantes
    //acesso o restaurante pelo id
    //acesso a coleção de avaliações desse restaurante
    //e o valueChanges para sempre estar atualizado
    return this._fireStore.collection('restaurantes')
    .doc(idRestaurante).collection('avaliações').valueChanges();
  }

  excluirComentario(idRestaurante: string, idUsuario: string) {
    //recebe o id do restaurante
    //+ id do usuario

    //entro na coleção de restaurantes
    //acesso o restaurante pelo id
    //acesso a coleção de avaliações desse restaurante
    //pego a avaliação do usuario pelo id
    //e deleta essa avaliação
    return this._fireStore.collection('restaurantes')
    .doc(idRestaurante).collection('avaliações').doc(idUsuario).delete();
  }
}
