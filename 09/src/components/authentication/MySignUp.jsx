import React from "react";
import { SignUp } from "aws-amplify-react";
import Auth from "@aws-amplify/auth";
import countryDialCodes from "aws-amplify-react/dist/Auth/common/country-dial-codes.js";
import App from "../../App";
import { auth } from "aws-amplify-react/dist/Amplify-UI/data-test-attributes";
import { I18n, ConsoleLogger as Logger } from "@aws-amplify/core";
import { PhoneField } from "aws-amplify-react/dist/Auth/PhoneField";
import {
  FormSection,
  SectionHeader,
  SectionBody,
  SectionFooter,
  FormField,
  Input,
  InputLabel,
  Button,
  Link,
  SectionFooterPrimaryContent,
  SectionFooterSecondaryContent,
  Hint
} from "aws-amplify-react/dist/Amplify-UI/Amplify-UI-Components-React";

import signUpWithUsernameFields, {
  signUpWithEmailFields,
  signUpWithPhoneNumberFields
} from "aws-amplify-react/dist/Auth/common/default-sign-up-fields";
import { UsernameAttributes } from "aws-amplify-react/dist/Auth/common/types";

const logger = new Logger("MySignUp");

export default class MySignUp extends SignUp {
  constructor(props) {
    super(props);

    this._validAuthStates = ["signUp", "confirmSignUp"];
    this.signUp = this.signUp.bind(this);
    this.sortFields = this.sortFields.bind(this);
    this.getDefaultDialCode = this.getDefaultDialCode.bind(this);
    this.checkCustomSignUpFields = this.checkCustomSignUpFields.bind(this);
    this.needPrefix = this.needPrefix.bind(this);
    this.showSignUpComponent = this.showSignUpComponent.bind(this);
    this.showConfirmSignUpComponent = this.showConfirmSignUpComponent.bind(
      this
    );
    this.header =
      this.props && this.props.signUpConfig && this.props.signUpConfig.header
        ? this.props.signUpConfig.header
        : "Create a new account";

    const { usernameAttributes = UsernameAttributes.USERNAME } =
      this.props || {};
    if (usernameAttributes === UsernameAttributes.EMAIL) {
      this.defaultSignUpFields = signUpWithEmailFields;
    } else if (usernameAttributes === UsernameAttributes.PHONE_NUMBER) {
      this.defaultSignUpFields = signUpWithPhoneNumberFields;
    } else {
      this.defaultSignUpFields = signUpWithUsernameFields;
    }

    this.confirm = this.confirm.bind(this);
    this.resend = this.resend.bind(this);
  }

  validate() {
    const invalids = [];
    this.signUpFields.map(el => {
      if (el.key !== "phone_number") {
        if (el.required && !this.inputs[el.key]) {
          el.invalid = true;
          invalids.push(el.label);
        } else {
          el.invalid = false;
        }
      } else {
        if (el.required && !this.phone_number) {
          el.invalid = true;
          invalids.push(el.label);
        } else {
          el.invalid = false;
        }
      }
      return el;
    });
    return invalids;
  }

  sortFields() {
    if (
      this.props.signUpConfig &&
      this.props.signUpConfig.hiddenDefaults &&
      this.props.signUpConfig.hiddenDefaults.length > 0
    ) {
      this.defaultSignUpFields = this.defaultSignUpFields.filter(d => {
        return !this.props.signUpConfig.hiddenDefaults.includes(d.key);
      });
    }

    if (this.checkCustomSignUpFields()) {
      if (
        !this.props.signUpConfig ||
        !this.props.signUpConfig.hideAllDefaults
      ) {
        // see if fields passed to component should override defaults
        this.defaultSignUpFields.forEach((f, i) => {
          const matchKey = this.signUpFields.findIndex(d => {
            return d.key === f.key;
          });
          if (matchKey === -1) {
            this.signUpFields.push(f);
          }
        });
      }

      /* 
            sort fields based on following rules:
            1. Fields with displayOrder are sorted before those without displayOrder
            2. Fields with conflicting displayOrder are sorted alphabetically by key
            3. Fields without displayOrder are sorted alphabetically by key
          */
      this.signUpFields.sort((a, b) => {
        if (a.displayOrder && b.displayOrder) {
          if (a.displayOrder < b.displayOrder) {
            return -1;
          } else if (a.displayOrder > b.displayOrder) {
            return 1;
          } else {
            if (a.key < b.key) {
              return -1;
            } else {
              return 1;
            }
          }
        } else if (!a.displayOrder && b.displayOrder) {
          return 1;
        } else if (a.displayOrder && !b.displayOrder) {
          return -1;
        } else if (!a.displayOrder && !b.displayOrder) {
          if (a.key < b.key) {
            return -1;
          } else {
            return 1;
          }
        }
        return 1;
      });
    } else {
      this.signUpFields = this.defaultSignUpFields;
    }
  }

  needPrefix(key) {
    const field = this.signUpFields.find(e => e.key === key);
    if (key.indexOf("custom:") !== 0) {
      return field.custom;
    } else if (key.indexOf("custom:") === 0 && field.custom === false) {
      logger.warn(
        "Custom prefix prepended to key but custom field flag is set to false; retaining manually entered prefix"
      );
    }
    return null;
  }

  getDefaultDialCode() {
    return this.props.signUpConfig &&
      this.props.signUpConfig.defaultCountryCode &&
      countryDialCodes.indexOf(
        `+${this.props.signUpConfig.defaultCountryCode}`
      ) !== "-1"
      ? `+${this.props.signUpConfig.defaultCountryCode}`
      : "+1";
  }

  checkCustomSignUpFields() {
    return (
      this.props.signUpConfig &&
      this.props.signUpConfig.signUpFields &&
      this.props.signUpConfig.signUpFields.length > 0
    );
  }

  signUp() {
    const validation = this.validate();
    if (validation && validation.length > 0) {
      return this.error(
        `The following fields need to be filled out: ${validation.join(", ")}`
      );
    }
    if (!Auth || typeof Auth.signUp !== "function") {
      throw new Error(
        "No Auth module found, please ensure @aws-amplify/auth is imported"
      );
    }

    const signup_info = {
      username: this.inputs.email,
      password: this.inputs.password,
      attributes: {}
    };

    this.setState({ signup_info });

    const inputKeys = Object.keys(this.inputs);
    const inputVals = Object.values(this.inputs);

    inputKeys.forEach((key, index) => {
      if (
        !["username", "password", "checkedValue", "dial_code"].includes(key)
      ) {
        if (
          key !== "phone_line_number" &&
          key !== "dial_code" &&
          key !== "error"
        ) {
          const newKey = `${this.needPrefix(key) ? "custom:" : ""}${key}`;
          signup_info.attributes[newKey] = inputVals[index];
        }
      }
    });

    let labelCheck = false;
    this.signUpFields.forEach(field => {
      if (field.label === this.getUsernameLabel()) {
        logger.debug(`Changing the username to the value of ${field.label}`);
        signup_info.username =
          signup_info.attributes[field.key] || signup_info.username;
        labelCheck = true;
      }
    });
    if (!labelCheck && !signup_info.username) {
      // if the customer customized the username field in the sign up form
      // He needs to either set the key of that field to 'username'
      // Or make the label of the field the same as the 'usernameAttributes'
      throw new Error(
        `Couldn't find the label: ${this.getUsernameLabel()}, in sign up fields according to usernameAttributes!`
      );
    }
    Auth.signUp(signup_info)
      .then(data => {
        this.changeState("confirmSignUp", data.user.username);
        App.setAfterRegisterValues(signup_info);
      })
      .catch(err => this.error(err));
  }

  confirm() {
    const username = this.usernameFromAuthData() || this.inputs.username;
    const { code } = this.inputs;
    if (!Auth || typeof Auth.confirmSignUp !== "function") {
      throw new Error(
        "No Auth module found, please ensure @aws-amplify/auth is imported"
      );
    }
    Auth.confirmSignUp(username, code)
      .then(async () => {
        const user = await Auth.signIn(this.inputs.email, this.inputs.password);
        console.log(user);
        this.changeState("signedIn", user);
      })
      .catch(err => this.error(err));
  }

  resend() {
    const username = this.usernameFromAuthData() || this.inputs.username;
    if (!Auth || typeof Auth.resendSignUp !== "function") {
      throw new Error(
        "No Auth module found, please ensure @aws-amplify/auth is imported"
      );
    }
    Auth.resendSignUp(username)
      .then(() => logger.debug("code resent"))
      .catch(err => this.error(err));
  }

  showComponent(theme) {
    if (this.props.authState === "signUp") {
      return this.showSignUpComponent(theme);
    }
    if (this.props.authState === "confirmSignUp") {
      return this.showConfirmSignUpComponent(theme);
    }
  }

  showConfirmSignUpComponent(theme) {
    const username = this.usernameFromAuthData();

    return (
      <FormSection theme={theme} data-test={auth.confirmSignUp.section}>
        <SectionHeader
          theme={theme}
          data-test={auth.confirmSignUp.headerSection}
        >
          {I18n.get("Confirm Sign Up")}
        </SectionHeader>
        <SectionBody theme={theme} data-test={auth.confirmSignUp.bodySection}>
          <FormField theme={theme}>
            <InputLabel theme={theme}>
              {I18n.get(this.getUsernameLabel())} *
            </InputLabel>
            <Input
              placeholder={I18n.get("Username")}
              theme={theme}
              key="username"
              name="username"
              onChange={this.handleInputChange}
              disabled={username}
              value={username ? username : ""}
              data-test={auth.confirmSignUp.usernameInput}
            />
          </FormField>

          <FormField theme={theme}>
            <InputLabel theme={theme}>
              {I18n.get("Confirmation Code")} *
            </InputLabel>
            <Input
              autoFocus
              placeholder={I18n.get("Enter your code")}
              theme={theme}
              key="code"
              name="code"
              autoComplete="off"
              onChange={this.handleInputChange}
              data-test={auth.confirmSignUp.confirmationCodeInput}
            />
            <Hint theme={theme}>
              {I18n.get("Lost your code? ")}
              <Link
                theme={theme}
                onClick={this.resend}
                data-test={auth.confirmSignUp.resendCodeLink}
              >
                {I18n.get("Resend Code")}
              </Link>
            </Hint>
          </FormField>
        </SectionBody>
        <SectionFooter theme={theme}>
          <SectionFooterPrimaryContent theme={theme}>
            <Button
              theme={theme}
              onClick={this.confirm}
              data-test={auth.confirmSignUp.confirmButton}
            >
              {I18n.get("Confirm")}
            </Button>
          </SectionFooterPrimaryContent>
          <SectionFooterSecondaryContent theme={theme}>
            <Link
              theme={theme}
              onClick={() => this.changeState("signIn")}
              data-test={auth.confirmSignUp.backToSignInLink}
            >
              {I18n.get("Back to Sign In")}
            </Link>
          </SectionFooterSecondaryContent>
        </SectionFooter>
      </FormSection>
    );
  }

  showSignUpComponent(theme) {
    if (this.checkCustomSignUpFields()) {
      this.signUpFields = this.props.signUpConfig.signUpFields;
    }
    this.sortFields();
    return (
      <FormSection theme={theme} data-test={auth.signUp.section}>
        <SectionHeader theme={theme} data-test={auth.signUp.headerSection}>
          {I18n.get(this.header)}
        </SectionHeader>
        <SectionBody theme={theme} data-test={auth.signUp.bodySection}>
          {this.signUpFields.map(field => {
            return field.key !== "phone_number" ? (
              <FormField theme={theme} key={field.key}>
                {field.required ? (
                  <InputLabel theme={theme}>
                    {I18n.get(field.label)} *
                  </InputLabel>
                ) : (
                  <InputLabel theme={theme}>{I18n.get(field.label)}</InputLabel>
                )}
                <Input
                  autoFocus={
                    this.signUpFields.findIndex(f => {
                      return f.key === field.key;
                    }) === 0
                      ? true
                      : false
                  }
                  placeholder={I18n.get(field.placeholder)}
                  theme={theme}
                  type={field.type}
                  name={field.key}
                  key={field.key}
                  onChange={this.handleInputChange}
                  data-test={auth.signUp.nonPhoneNumberInput}
                />
              </FormField>
            ) : (
              <PhoneField
                theme={theme}
                required={field.required}
                defaultDialCode={this.getDefaultDialCode()}
                label={field.label}
                placeholder={field.placeholder}
                onChangeText={this.onPhoneNumberChanged}
                key="phone_number"
              />
            );
          })}
        </SectionBody>
        <SectionFooter theme={theme} data-test={auth.signUp.footerSection}>
          <SectionFooterPrimaryContent theme={theme}>
            <Button
              onClick={this.signUp}
              theme={theme}
              data-test={auth.signUp.createAccountButton}
            >
              {I18n.get("Create Account")}
            </Button>
          </SectionFooterPrimaryContent>
          <SectionFooterSecondaryContent theme={theme}>
            {I18n.get("Have an account? ")}
            <Link
              theme={theme}
              onClick={() => this.changeState("signIn")}
              data-test={auth.signUp.signInLink}
            >
              {I18n.get("Sign in")}
            </Link>
          </SectionFooterSecondaryContent>
        </SectionFooter>
      </FormSection>
    );
  }
}
