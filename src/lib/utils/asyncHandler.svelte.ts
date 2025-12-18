import { toast } from "svelte-sonner";

type AsyncOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  showToast?: boolean;
}

export class AsyncRequest<T> {
  loading = $state(false);
  error = $state<string | null>(null);
  data = $state<T | null>(null);

  async call(promise: Promise<T>, options: AsyncOptions<T> = {}) {
    this.loading = true;
    this.error = null;

    try {
      const result = await promise;
      this.data = result;

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (err: any) {
      const message = err.message || 'Something went wrong';
      this.error = message

      if (options.showToast !== false) {
        toast.error(message);
      }

      if (options.onError) {
        options.onError(message)
      }

      return null;
    } finally {
      this.loading = false;
    }
  }
}