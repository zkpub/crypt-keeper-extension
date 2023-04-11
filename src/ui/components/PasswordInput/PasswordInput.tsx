import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import { forwardRef, InputHTMLAttributes, Ref } from "react";

import { Icon } from "../Icon";
import { Input } from "../Input";

import "./passwordInput.scss";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isShowHint: boolean;
  isShowPassword: boolean;
  onShowPassword: () => void;
  errorMessage?: string;
}

const PasswordInputUI = (
  { isShowHint, errorMessage = undefined, isShowPassword, onShowPassword, ...passwordInputProps }: PasswordInputProps,
  inputRef: Ref<HTMLInputElement>,
): JSX.Element => (
  <Input
    autoFocus
    className="mb-4 password-input__content"
    endAdornment={
      <InputAdornment position="end">
        {isShowHint ? (
          <Tooltip
            key={1}
            className="password-input__info-tooltip"
            title={
              <div>
                <p>Password requirements:</p>

                <p>- At least 8 characters</p>

                <p>- At least 1 upper case and letter</p>

                <p>- At least 1 lower case letter</p>

                <p>- At least 1 special character (!@#$%^&*)</p>

                <p>- At least 1 number</p>
              </div>
            }
          >
            <Icon className="password-input__info-icon" fontAwesome="fa-info" />
          </Tooltip>
        ) : null}

        {isShowPassword ? (
          <Tooltip
            key={2}
            className="eye-tooltip"
            data-testid="eye-slash-button"
            title="Hide Password"
            onClick={onShowPassword}
          >
            <Icon className="password-input__info-icon" fontAwesome="fa-eye-slash" />
          </Tooltip>
        ) : (
          <Tooltip
            key={2}
            className="eye-tooltip"
            data-testid="eye-look-button"
            title="Show Password"
            onClick={onShowPassword}
          >
            <Icon className="password-input__info-icon" fontAwesome="fa-eye" />
          </Tooltip>
        )}
      </InputAdornment>
    }
    errorMessage={errorMessage}
    id="password"
    inputRef={inputRef}
    label="Password"
    type={isShowPassword ? "text" : "password"}
    {...passwordInputProps}
  />
);

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(PasswordInputUI);