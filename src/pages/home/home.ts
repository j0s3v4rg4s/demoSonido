import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { MediaPlugin, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	miSound: MediaObject
	miSound2: MediaObject

	onStatusUpdate = (status) => console.log(status);
	onSuccess = () => console.log('Action is successful.');
	onError = (error) => console.error(error);

	path: string

	name = 'my_file3.wav'

	constructor(public navCtrl: NavController, private media: MediaPlugin, private file: File, private platform: Platform) {
		this.generarPath()
	}

	generarPath() {
		if (this.platform.is('android'))
			this.path = this.file.externalApplicationStorageDirectory
		else
			this.path = this.file.tempDirectory
		console.log(this.path)
	}

	crearSound() {
		if (this.path == null)
			this.generarPath()

		if (this.platform.is('android')) {
			this.miSound = this.media.create(this.path + this.name, this.onStatusUpdate, this.onSuccess, this.onError)
			console.log(this.miSound)
		}
		else {
			this.file.createFile(this.file.tempDirectory, this.name, true).then(() => {
				this.miSound = this.media.create(this.file.tempDirectory.replace(/^file:\/\//, '') + this.name, this.onStatusUpdate, this.onSuccess, this.onError);
				console.log(this.miSound)
			});
		}

	}

	record() {
		this.miSound.startRecord()
	}

	stopRecor() {
		this.miSound.stopRecord()
	}

	playSound() {
		this.miSound.play()

	}

	validarFile() {
		this.file.checkFile(this.path, this.name).then(
			ok => console.log(ok),
			err => console.log(err)
		)
	}

	leerArchivo() {
		this.file.readAsDataURL(this.path, this.name).then(
			data => {
				console.log(data)
				this.cargarrNewFile(data)

			},
			err => console.log(err)
		)
	}

	cargarrNewFile(data) {
		let bold = this.dataURItoBlob(data)
		this.file.writeFile(this.path, 'nuevo.wav', bold, { replace: true }).then(
			ok => {
				console.log(ok)
				if (this.platform.is('android')) {
					this.miSound2 = this.media.create(this.path + 'nuevo.wav', this.onStatusUpdate, this.onSuccess, this.onError)
				}
				else {
					this.miSound2 = this.media.create(this.file.tempDirectory.replace(/^file:\/\//, '') + 'nuevo.wav', this.onStatusUpdate, this.onSuccess, this.onError);
				}
			},
			err => {
				console.log(err)
			}
		)

	}

	dataURItoBlob(dataURI: string): Blob {
		var arr = dataURI.split(','), mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], { type: mime });
	}


	leer2(){
		this.miSound2.play()
	}

}
