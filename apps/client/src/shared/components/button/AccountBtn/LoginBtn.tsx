import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

import { authApi } from "../../../apis";
import type { TReturnAccessToken } from "../../../hooks/useAccessToken";

interface IProps {
  setToken: TReturnAccessToken["setToken"];
}

const LoginBtn = ({ setToken }: IProps) => {
  const Btn = () => {
    const login = useGoogleLogin({
      flow: "auth-code",
      onSuccess: async (codeResponse) => {
        const { success, data } = await authApi.postExchangeGoogleCode(
          codeResponse.code
        );

        if (success) setToken(data.accessToken);
      },
      onError: (errorResponse) => console.log(errorResponse),
    });

    return <button onClick={login}>Google Login</button>;
  };

  return (
    <GoogleOAuthProvider clientId="410615180419-ctk5hh2kp6l04ki3vmb0h76mdmse4v1m.apps.googleusercontent.com">
      <Btn />
    </GoogleOAuthProvider>
  );
};

export default LoginBtn;
