import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
} from "./../../components/components/ui/form";
import React, { useState } from "react";
import { Button } from "./../../components/components/ui/button";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/hooks/use-toast";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

const SignIn = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      toast({
        title: t("auth.success_connection"),
        description: t("auth.success_connection_description"),
      });
      navigate("/");
    } catch (error: any) {
      console.error(t("auth.error_connection"), error);

      if (error.response) {
        const status = error.response.status;

        if (status === 401) {
          toast({
            variant: "destructive",
            title: t("auth.error_connection"),
            description: t("auth.error_connection_description"),
          });
        } else if (status === 200) {
          toast({
            title: t("auth.success_connection"),
            description: t("auth.success_connection_description"),
          });
          navigate("/");
        } else {
          toast({
            variant: "destructive",
            title: t("auth.error_connection"),
            description: t("auth.error_connection_description"),
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: t("auth.error_connection"),
          description: t("auth.error_connection_description"),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-[100%] md:w-[100%]  h-screen items-center justify-center md:flex-row overflow-auto">
      <div className="flex flex-col w-full md:w-1/3 h-full bg-white items-center justify-center">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 gap-4">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-[40px] w-[60px] md:h-[50px] md:w-[75px] cursor-pointer"
            />
            <div className="text-3xl font-bold mb-4 md:text-2xl mt-1 md:mt-2">
              <h3>{t("app.name")}</h3>
            </div>
          </div>
          <div className="italic mb-4">
            <h1>{t("auth.connect")}</h1>
          </div>
        </div>
        <div className="text-center mb-8">
          <Form {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <FormField
                name="email"
                rules={{
                  required: t("auth.required_email"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("auth.invalid_email"),
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        {...field}
                        type="email"
                        placeholder={t("auth.email")}
                        className="input-class bg-white h-15 w-[80%] rounded-full border shadow-md font-bold p-4"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                rules={{
                  required: t("auth.required_password"),
                  minLength: {
                    value: 6,
                    message: t("auth.min_length_password"),
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative m-4 w-[80%] mx-auto">
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder={t("auth.password")}
                          className="input-class bg-white h-15 w-full rounded-full border shadow-md font-bold p-4 pr-12"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent border-none outline-none focus:outline-none focus:ring-0"
                          onClick={togglePasswordVisibility}>
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-0 w-80">
                <a
                  href="/forgot-password"
                  className="text-purple-600 hover:underline text-left">
                  {t("auth.forgot_password")}
                </a>
              </div>
              <div className="inline-grid justify-center">
                <Button
                  type="submit"
                  disabled={!methods.formState.isValid || isLoading}
                  className="btn-submit m-8 mb-2 bg-[rgb(98,67,124)] hover:bg-purple-800 text-white px-10 py-5 rounded-md w-60 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("auth.loading")}
                    </>
                  ) : (
                    t("auth.login")
                  )}
                </Button>
                <a
                  href="/onboard"
                  className="text-purple-600 hover:underline flex items-center gap-1 text-left ml-8">
                  <ArrowLeft className="h-4 w-4" />
                  {t("back.onboard")}
                </a>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="hidden md:block md:w-2/3 h-full">
        <img
          src="connexion.png"
          alt="page de connexion"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default SignIn;
