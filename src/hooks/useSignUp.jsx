// useSignUp.js
import { useContext, useState } from "react";
import { useAuthContext } from "./authHooks";

export const useSignUp = () => {
      const [error, setError] = useState(null);
      const [isLoading, setIsLoading] = useState(false);
      const { dispatch } = useAuthContext();

      const signup = async (username, email, password) => {
            setIsLoading(true);
            setError(null);

            try {
                  const response = await fetch('http://localhost:4000/api/user/register', {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, email, password })
                  });

                  if (!response.ok) {
                        let errorData;
                        try {
                              errorData = await response.json();
                        } catch (jsonError) {
                              console.error('Error parsing JSON from error response:', jsonError);
                        }

                        const errorMessage = errorData && errorData.error ? errorData.error : 'Unknown error';
                        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
                  }

                  const json = await response.json();

                  localStorage.setItem('user', JSON.stringify(json));
                  dispatch({ type: 'LOGIN', payload: json });
                  setIsLoading(false);
            } catch (error) {
                  setIsLoading(false);
                  setError(error.message);
                  console.error("Error during signup:", error);
            }
      };


      return { signup, isLoading, error };
};