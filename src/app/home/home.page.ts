// Hemen erabiliko diren gauzak inportatzen dira, Javan bezala.
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { WeatherService } from '../services/weather-service.service';
import { WeatherData } from '../interfaces/weather-data';
import { jsPDF } from 'jspdf';

@Component({ // Gauza hauek horrela defektuz uzten dita (standalone konfigurazioa izan ezik).
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage { // Orritik deitzeko, hauek etiketak bilakatzen dira.
  city: string = '';
  weatherData!: WeatherData;
  @ViewChild('lineChart') lineChart!: ElementRef;
  @ViewChild('barChart') barChart!: ElementRef;
  @ViewChild('radarChart') radarChart!: ElementRef;

  constructor(private weatherService: WeatherService) {}

  fetchWeather() { // Datuak lortzeko erabiltzen da, eta ailegatzen direnean grafikoak eguneratzen ditu.
    if (!this.city) return;
    this.weatherService.fetchWeather(this.city).subscribe(data => {
      this.weatherData = data;
      this.generateChartData();
    });
  }

  generateChartData() { // Datuak lortzeko eta grafikoak sortzek erabiltzen da.
    const labelsNextDays = this.weatherData.list.slice(0, 16).map(entry => entry.dt_txt);
    const tempsNextDays = this.weatherData.list.slice(0, 16).map(entry => entry.main.temp);
    new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: { labels: labelsNextDays, datasets: [{ label: 'Hurrengo egunetako tenperatura', data: tempsNextDays, borderColor: 'blue' }] }
    });

    const labelsPastDays = ['1.go eguna', '2. eguna', '3. eguna', '4. eguna', '5. eguna', '6. eguna', '7. eguna'];
    const tempsPastDays = [20, 18, 21, 19, 22, 23, 25];
    new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: { labels: labelsPastDays, datasets: [{ label: 'Aurreko egunetako tenperatura', data: tempsPastDays, backgroundColor: 'orange' }] }
    });

    const labelsToday = ['Tenperatura', 'Hezetasuna', 'Haizea', 'Presioa'];
    const valuesToday = [
      this.weatherData.list[0].main.temp,
      this.weatherData.list[0].main.humidity,
      this.weatherData.list[0].wind.speed,
      this.weatherData.list[0].main.pressure
    ];
    new Chart(this.radarChart.nativeElement, {
      type: 'radar',
      data: { labels: labelsToday, datasets: [{ label: 'Gaurko estatistikak', data: valuesToday, backgroundColor: 'rgba(0, 255, 0, 0.5)' }] }
    });
  }

  generatePDF() { // PDF-a sortzen du.
    const doc = new jsPDF();
    doc.text('Reportea', 20, 20);
    if (!this.weatherData || !this.city) {
      alert('Ez daude daturik.');
      return;
    }
    doc.text(`Herria: ${this.city}`, 20, 40);
    doc.text(`Oraingo tenperatura: ${this.weatherData.list[0].main.temp}°C`, 20, 50);
    doc.text(`Hezetasuna: ${this.weatherData.list[0].main.humidity}%`, 20, 60);
    doc.text(`Haizea: ${this.weatherData.list[0].wind.speed} m/s`, 20, 70);
    
    const charts = [this.lineChart.nativeElement, this.barChart.nativeElement, this.radarChart.nativeElement];
    charts.forEach((chart, index) => {
      const chartImage = chart.toDataURL('image/png');
      doc.addImage(chartImage, 'PNG', 10, 80 + index * 60, 180, 60);
    });
    
    const img = new Image();
    img.src = 'assets/icon/favicon.png';
    img.onload = () => {
      doc.addImage(img, 'PNG', 150, 10, 40, 40);
      doc.save('Klima_reportea.pdf');
    };
  }
}
