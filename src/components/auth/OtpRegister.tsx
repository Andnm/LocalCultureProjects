import React, { useState, useRef, FC, ChangeEvent, KeyboardEvent } from "react";
import "@/src/styles/auth/otp-register.scss";
import Message from "../shared/Message";

interface OtpRegisterProps {
  email: string | undefined;
  verifyAction: () => void;
  inputsRef: any;
  error: string;
  setError: () => void;
  resendOtp: () => void;
}

const OtpRegister: FC<OtpRegisterProps> = ({
  email,
  verifyAction,
  inputsRef,
  error,
  setError,
  resendOtp,
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const digits = pastedData.replace(/\D/g, "").split("");

    digits.forEach((digit, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index].value = digit;
      }
    });

    const emptyInput = inputsRef.current.find(
      (input: HTMLInputElement) => input.value === ""
    );
    if (emptyInput) {
      emptyInput.focus();
    } else {
      inputsRef.current[inputsRef.current.length - 1].focus();
    }
  };

  const handleInput = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (setError) {
      setError();
    }

    const inputLength = (e as React.ChangeEvent<HTMLInputElement>).target.value
      .length;
    const maxLength =
      (e as React.ChangeEvent<HTMLInputElement>).target.maxLength || 0;

    const isKeyboardEvent =
      (e as React.KeyboardEvent<HTMLInputElement>).key !== undefined;

    if (
      isKeyboardEvent &&
      (e as React.KeyboardEvent<HTMLInputElement>).key === "Backspace" &&
      inputLength === 0 &&
      index > 0
    ) {
      inputsRef.current[index - 1].value = "";
      inputsRef.current[index - 1].focus();
    } else if (
      inputLength >= maxLength &&
      index < inputsRef.current.length - 1
    ) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    const regex = /[0-9]/;

    if (!regex.test(keyValue)) {
      e.preventDefault();
    }
  };

  const checkButtonDisabled = () => {
    setIsButtonDisabled(
      (prev) =>
        inputsRef.current.filter(
          (input: HTMLInputElement | null) => input?.value !== ""
        ).length !== 6
    );
  };

  const handleVerify = () => {
    if (!isButtonDisabled) {
      verifyAction();
    }
  };

  return (
    <div className="otp-register w-full flex my-4 justify-center">
      <div
        className="otp-Form py-10 border-2 w-1/2"
        style={{ borderRadius: "25px" }}
      >
        <div className="title">Xác minh OTP</div>{" "}
        <p className="message">
          Quý lòng nhập mã OTP đã được gửi tới email {email} của bạn
        </p>
        <div className="inputs">
          <input
            ref={(ref) => (inputsRef.current[0] = ref)}
            type="text"
            maxLength={1}
            onKeyDown={(e) => handleInput(e, 0)}
            onKeyUp={checkButtonDisabled}
            onKeyPress={handleKeyPress}
            onPaste={handlePaste}
          />
          <input
            ref={(ref) => (inputsRef.current[1] = ref)}
            type="text"
            maxLength={1}
            onKeyDown={(e) => handleInput(e, 1)}
            onKeyUp={checkButtonDisabled}
            onKeyPress={handleKeyPress}
          />
          <input
            ref={(ref) => (inputsRef.current[2] = ref)}
            type="text"
            maxLength={1}
            onKeyDown={(e) => handleInput(e, 2)}
            onKeyUp={checkButtonDisabled}
            onKeyPress={handleKeyPress}
          />
          <input
            ref={(ref) => (inputsRef.current[3] = ref)}
            type="text"
            maxLength={1}
            onKeyDown={(e) => handleInput(e, 3)}
            onKeyUp={checkButtonDisabled}
            onKeyPress={handleKeyPress}
          />
          <input
            ref={(ref) => (inputsRef.current[4] = ref)}
            type="text"
            maxLength={1}
            onKeyDown={(e) => handleInput(e, 4)}
            onKeyUp={checkButtonDisabled}
            onKeyPress={handleKeyPress}
          />
          <input
            ref={(ref) => (inputsRef.current[5] = ref)}
            type="text"
            maxLength={1}
            onKeyDown={(e) => handleInput(e, 5)}
            onKeyUp={checkButtonDisabled}
            onKeyPress={handleKeyPress}
          />
        </div>
        {error && <Message text_color={"text-red-500"} text={error} />}
        <button
          className={`verifyButton ${
            isButtonDisabled ? "button-none-event" : ""
          }`}
          type="submit"
          onClick={handleVerify}
        >
          Xác nhận
        </button>
        <div className="flex items-center gap-2">
          <p className="resendNote">Bạn chưa nhận được OTP?</p>

          <button className="resendBtn" onClick={resendOtp}>
            <p>Gửi lại!</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpRegister;
