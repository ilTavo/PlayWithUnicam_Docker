import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertCreatorService } from 'src/app/services/alert-creator/alert-creator.service';
import { ErrorManagerService } from 'src/app/services/error-manager/error-manager.service';
import { LoginService } from 'src/app/services/login-service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['../auth.scss'],
})
export class LoginPage implements OnInit {
  credenziali: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private loadingController: LoadingController,
    private alertCreator: AlertCreatorService,
    private errorManager: ErrorManagerService
  ) { }

  ngOnInit() {
    this.credenziali = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  /**
   * Effettua il Login dell'Utente:
   * * Se l'esito del Login è uguale ad 1 allora l'Utente verrà reindirizzato
   * alla pagina "/player/dashboard".
   * * Se l'esito del Login è uguale a 2 allora l'Utente verrà reindirizzato
   * alla pagina "/admin".
   */
  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.loginService.login(this.credenziali.value).subscribe(
      async (res) => {
        await loading.dismiss();

        switch (res) {
          case "1":
            this.router.navigateByUrl('/player/dashboard', { replaceUrl: true });
            break;
          case "2":
            this.router.navigateByUrl('/admin', { replaceUrl: true });
            break;
          default:
            this.alertCreator.createInfoAlert('Login fallito', 'Rieffettua il Login');
        }
      },
      async (res) => {
        await loading.dismiss();
        this.errorManager.stampaErrore(res, 'Login Fallito');
      }
    );
  }
}