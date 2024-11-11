import axios from 'axios';
import { API_URL } from './config/link_api'
import type { ProductionsProps } from '../sections/production/table-row';
import type { FormProps } from '../sections/auth/sign-in-view';

axios.defaults.withCredentials = true;

// Want to use async/await? Add the `async` keyword to your outer function/method.
export async function LoginApi(form: FormProps) {
  try {
    const response = await axios.post(
      API_URL.LOGIN, form, {
      headers: {
        ...API_URL.CONTENT_TYPE,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw (error);
  }
}

export async function LogoutApi() {
  try {
    const response = await axios.post(
      API_URL.LOGOUT, {
      headers: {
        ...API_URL.CONTENT_TYPE,
      },
    });

    return response;
  } catch (error) {
    console.error(error);
    throw (error);
  }
}

export async function DashboardApi() {
  try {
    const response = await axios.get(
      API_URL.GET_DASHBOARD, {
      headers: {
        ...API_URL.CONTENT_TYPE,
      }
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw (error);
  }
}

export async function ProductionApi() {
  try {
    const response = await axios.get(
      API_URL.GET_PRODUCTION, {
      headers: {
        ...API_URL.CONTENT_TYPE,
      }
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw (error);
  }
}

export async function ProductionUpdateApi(form: ProductionsProps) {
  try {
    const response = await axios.post(
      API_URL.POST_PRODUCTION_UPDATE,
      {
        id: form.id,
        machine: form.machine,
        lot_number: form.lot_number,
        product: form.product,
        batch_size: form.batch_size,
        start_product: form.start_product,
        finish_product: form.finish_product,
        notes: form.notes,
      },
      {
        headers: {
          ...API_URL.CONTENT_TYPE,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw (error);
  }
}

export async function ProductionDeleteApi(form: ProductionsProps) {
  try {
    const response = await axios.post(
      API_URL.POST_PRODUCTION_DELETE,
      {
        id: form.id
      },
      {
        headers: {
          ...API_URL.CONTENT_TYPE,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw (error);
  }
}

export async function DetailApi(machine: string, start_product: string, finish_product: string) {
  try {
    const response = await axios.post(
      API_URL.GET_DETAILS,
      {
        machine,
        start_product,
        finish_product,
      },
      {
        headers: {
          ...API_URL.CONTENT_TYPE,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function ProductListsApi() {
  try {
    const response = await axios.get(
      API_URL.GET_PRODUCT_LISTS, {
      headers: {
        ...API_URL.CONTENT_TYPE,
      }
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw (error);
  }
}

export async function MachineListsApi() {
  try {
    const response = await axios.get(
      API_URL.GET_MACHINE_LISTS, {
      headers: {
        ...API_URL.CONTENT_TYPE,
      }
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw (error);
  }
}


