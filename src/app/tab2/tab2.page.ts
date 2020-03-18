import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ValidationErrors } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: [''],
  });

  constructor(
    private fb: FormBuilder,
    public toastController: ToastController,
    public contactService: ContactService

  ) { }

  onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }
    console.log(this.contactForm.value);

    this.contactService.send(this.contactForm.value).subscribe(data => {
      console.log(data);
      this.presentToast('Mensaje enviado con éxito');
      this.contactForm.reset();
    }, error => {
      if (error.status === 404) {
        this.presentToast('Error al intentar conectarse con el servidor');
      }
    });

  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
