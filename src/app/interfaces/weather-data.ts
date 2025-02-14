// Objektu bat da.
export interface WeatherData {
    list: {
      dt_txt: string;
      main: {
        temp: number;
        humidity: number;
        pressure: number;
      };
      wind: {
        speed: number;
      };
    }[];
  }
  