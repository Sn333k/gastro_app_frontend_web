import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { LoginRequestDto } from '../dto/AuthDto';
import { GetDoctorDto } from '../dto/DoctorDto';
import { CreatePatientDto, CreatePatientResponseDto } from '../dto/PatientDto';
import { CreateDrugDto } from '../dto/DrugDto';

export type ClientResponse<T> = {
  success: boolean;
  data: T;
  status: number;
};

export class GastroappClient {
  private baseUrl = 'http://127.0.0.1:8000';
  private client: AxiosInstance;
  private token: string | null = null;
  private cookies = new Cookies();

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
    });

    this.client.interceptors.request.use((config) => {
      const token = this.cookies.get('access_token');
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  public async login(
    data: LoginRequestDto
  ): Promise<ClientResponse<undefined | Error>> {
    try {
      const response: AxiosResponse = await this.client.post('/login/', data);

      const decoded = jwtDecode<JwtPayload>(response.data.access_token);

      if (decoded.exp) {
        this.cookies.set('access_token', response.data.access_token, {
          expires: new Date(decoded.exp * 1000),
        });
      }
      return {
        success: true,
        data: undefined,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: axiosError.response?.data,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async getAllDoctors(): Promise<
    ClientResponse<GetDoctorDto[] | undefined>
  > {
    try {
      const response: AxiosResponse<GetDoctorDto[]> = await this.client.get(
        'api/get_all_doctors'
      );

      console.log(response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      console.log(error);

      return {
        success: false,
        data: undefined,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async getDoctorById(
    doctorId: string
  ): Promise<ClientResponse<GetDoctorDto | undefined>> {
    try {
      const response: AxiosResponse<GetDoctorDto> = await this.client.get(
        `api/get_doctor`,
        {
          params: {
            id: doctorId,
          },
        }
      );

      console.log(response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      console.log(error);

      return {
        success: false,
        data: undefined,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async createPatient(
    data: CreatePatientDto
  ): Promise<ClientResponse<CreatePatientResponseDto | undefined>> {
    try {
      const response: AxiosResponse<CreatePatientResponseDto> =
        await this.client.post('/api/create_patient', data);

      console.log(response.data);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: undefined,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async assignPatient(
    patient_id: string
  ): Promise<ClientResponse<undefined | Error>> {
    try {
      const response: AxiosResponse = await this.client.post(
        '/api/assign_patient',
        { patient_id: patient_id }
      );

      console.log(response.data);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: undefined,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async assignDrugToPatient(
    patient_id: string
  ): Promise<ClientResponse<Error | undefined>> {
    try {
      const response: AxiosResponse = await this.client.post(
        `api/assign_drug_to_patient`,
        {
          params: {
            id: patient_id,
          },
        }
      );

      console.log(response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      console.log(error);

      return {
        success: false,
        data: undefined,
        status: axiosError.response?.status || 0,
      };
    }
  }
}
