import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Preferences} from '@capacitor/preferences';
import {LiferayService} from '../liferay.service';
import { LoadingController,AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  ionicForm: FormGroup;
  isSubmitted = false;
  loading: any;
  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      id:"loading",
      message:"Validating information!"
    });
    this.loading.present();
  }
  constructor(private alertController: AlertController,private router: Router, public formBuilder: FormBuilder,private loadingCtrl: LoadingController) {
    this.ionicForm = this.formBuilder.group({
      url: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    //this.ionicForm.controls.url.setValue("https://webserver-lctrobotics74-prd.lfr.cloud") ;
    //this.ionicForm.controls.username.setValue("test@liferaybotics.com") ;
    //this.ionicForm.controls.password.setValue ("Gloria1234!") ;
  }
  get errorControl() {
    return this.ionicForm.controls;
  }
  async start() {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      return false;
    } else {
      if (await this.storeInformation()) {
        this.router.navigate(['/router']);
      }else
      {
        this.errorInvalidInfo();
      }
      return true;
    }
  }
  async errorInvalidInfo()
  {
    const alert = await this.alertController.create({
      header: 'Setup Error',
      message: 'The provided information is invalid!',
      buttons: ['OK'],
    });
    await alert.present();
  }
  async storeInformation() {
    await this.showLoading();
    LiferayService.portalInformation.url = this.ionicForm.controls.url.value;
    LiferayService.portalInformation.user = this.ionicForm.controls.username.value;
    LiferayService.portalInformation.password = this.ionicForm.controls.password.value;
    const result =   await LiferayService.getUserInformation();
    this.loading.dismiss();
    return result;
  }
}
