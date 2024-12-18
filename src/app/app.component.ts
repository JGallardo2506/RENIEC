import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, HttpClientModule , CommonModule , RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent  {
}
