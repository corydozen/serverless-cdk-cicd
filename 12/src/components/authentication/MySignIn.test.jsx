import Auth from "@aws-amplify/auth";
import React from "react";
import MySignIn from "./MySignIn";
import {
  Header,
  Footer,
  Input,
  Button
} from "aws-amplify-react/dist/Amplify-UI/Amplify-UI-Components-React";

const acceptedStates = [
  "signIn",
  "signedUp",
  "signedOut",
  "customConfirmSignIn"
];

const deniedStates = [
  "signUp",
  "signedIn",
  "comfirmSignIn",
  "confirmSignUp",
  "forgotPassword",
  "verifyContact"
];

const fakeEvent = {
  preventDefault: jest.fn()
};

describe("MySignIn", () => {
  it("should load without crashing", () => {
    const wrapper = shallow(<MySignIn />);
  });
  describe("normal case", () => {
    test("render correctly with Props signIn, signedOut or signedUp", () => {
      for (let i = 0; i < acceptedStates.length; i += 1) {
        const wrapper = shallow(<MySignIn />);
        wrapper.setProps({
          authState: acceptedStates[i]
        });

        expect(wrapper).toMatchSnapshot();
      }
    });

    test("render correctly with hide", () => {
      for (let i = 0; i < acceptedStates.length; i += 1) {
        const wrapper = shallow(<MySignIn />);
        wrapper.setProps({
          authState: acceptedStates[i],
          hide: [MySignIn]
        });

        expect(wrapper).toMatchSnapshot();
      }
    });

    test("when clicking signIn and new password required", async () => {
      const wrapper = shallow(<MySignIn />);
      wrapper.setProps({
        authState: "signIn"
      });

      const spyon = jest
        .spyOn(Auth, "signIn")
        .mockImplementationOnce((user, password) => {
          return new Promise((res, rej) => {
            res({
              challengeName: "NEW_PASSWORD_REQUIRED"
            });
          });
        });

      const spyon_changeState = jest.spyOn(wrapper.instance(), "changeState");

      const event_email = {
        target: {
          name: "email",
          value: "user1@example.com"
        }
      };
      const event_password = {
        target: {
          name: "password",
          value: "abc"
        }
      };

      wrapper
        .find(Input)
        .at(0)
        .simulate("change", event_email);
      wrapper
        .find(Input)
        .at(1)
        .simulate("change", event_password);
      wrapper
        .find("form")
        .at(0)
        .simulate("submit", fakeEvent);

      await Promise.resolve();

      expect(spyon.mock.calls.length).toBe(1);
      expect(spyon.mock.calls[0][0]).toBe(event_email.target.value);
      expect(spyon.mock.calls[0][1]).toBe(event_password.target.value);

      expect(spyon_changeState).toBeCalled();
      expect(spyon_changeState.mock.calls[0][0]).toBe("requireNewPassword");

      spyon.mockClear();
      spyon_changeState.mockClear();
    });

    test("when clicking signIn and trigger-based custom auth challenge present required", async () => {
      const wrapper = shallow(<MySignIn />);
      wrapper.setProps({
        authState: "signIn"
      });

      const spyon = jest
        .spyOn(Auth, "signIn")
        .mockImplementationOnce((user, password) => {
          return new Promise((res, rej) => {
            res({
              challengeName: "CUSTOM_CHALLENGE",
              challengeParam: { trigger: "true" }
            });
          });
        });

      const spyon_changeState = jest.spyOn(wrapper.instance(), "changeState");

      const event_email = {
        target: {
          name: "email",
          value: "user1@example.com"
        }
      };
      const event_password = {
        target: {
          name: "password",
          value: "abc"
        }
      };

      wrapper
        .find(Input)
        .at(0)
        .simulate("change", event_email);
      wrapper
        .find(Input)
        .at(1)
        .simulate("change", event_password);
      wrapper
        .find("form")
        .at(0)
        .simulate("submit", fakeEvent);

      await Promise.resolve();

      expect(spyon.mock.calls.length).toBe(1);
      expect(spyon.mock.calls[0][0]).toBe(event_email.target.value);
      expect(spyon.mock.calls[0][1]).toBe(event_password.target.value);

      expect(spyon_changeState).toBeCalled();
      expect(spyon_changeState.mock.calls[0][0]).toBe("customConfirmSignIn");

      spyon.mockClear();
      spyon_changeState.mockClear();
    });

    test("when clicking signIn and user session null, need verification of email", async () => {
      const wrapper = shallow(<MySignIn />);
      wrapper.setProps({
        authState: "signIn"
      });

      const spyon = jest
        .spyOn(Auth, "signIn")
        .mockImplementationOnce((user, password) => {
          return new Promise((res, rej) => {
            res({
              Session: null
            });
          });
        });

      const spyon2 = jest
        .spyOn(Auth, "userAttributes")
        .mockImplementationOnce(() => {
          return new Promise((res, rej) => {
            res([
              {
                Name: "email",
                Value: "email_val"
              }
            ]);
          });
        });

      const spyon_changeState = jest.spyOn(wrapper.instance(), "changeState");

      const event_email = {
        target: {
          name: "email",
          value: "user1@example.com"
        }
      };
      const event_password = {
        target: {
          name: "password",
          value: "abc"
        }
      };

      wrapper
        .find(Input)
        .at(0)
        .simulate("change", event_email);
      wrapper
        .find(Input)
        .at(1)
        .simulate("change", event_password);
      wrapper
        .find("form")
        .at(0)
        .simulate("submit", fakeEvent);

      // expect(spyon_changeState).toBeCalled();

      spyon.mockClear();
      spyon2.mockClear();
      spyon_changeState.mockClear();
    });

    test("when clicking signIn and user session null, dont need verification", async () => {
      const wrapper = shallow(<MySignIn />);
      wrapper.setProps({
        authState: "signIn"
      });

      const spyon = jest
        .spyOn(Auth, "signIn")
        .mockImplementationOnce((user, password) => {
          return new Promise((res, rej) => {
            res({
              Session: null
            });
          });
        });

      const spyon2 = jest
        .spyOn(Auth, "userAttributes")
        .mockImplementationOnce(() => {
          return new Promise((res, rej) => {
            res([
              {
                Name: "email_verfied",
                Value: true
              }
            ]);
          });
        });

      const spyon_changeState = jest.spyOn(wrapper.instance(), "changeState");

      const event_email = {
        target: {
          name: "email",
          value: "user1@example.com"
        }
      };
      const event_password = {
        target: {
          name: "password",
          value: "abc"
        }
      };

      wrapper
        .find(Input)
        .at(0)
        .simulate("change", event_email);
      wrapper
        .find(Input)
        .at(1)
        .simulate("change", event_password);
      wrapper
        .find("form")
        .at(0)
        .simulate("submit", fakeEvent);

      // expect(spyon_changeState).toBeCalled();

      spyon.mockClear();
      spyon2.mockClear();
      spyon_changeState.mockClear();
    });

    test("when clicking signIn and error happend", async () => {
      const wrapper = shallow(<MySignIn />);
      wrapper.setProps({
        authState: "signIn"
      });

      const spyon = jest
        .spyOn(Auth, "signIn")
        .mockImplementationOnce((user, password) => {
          return new Promise((res, rej) => {
            rej("err");
          });
        });

      const spyon2 = jest.spyOn(wrapper.instance(), "error");

      const event_email = {
        target: {
          name: "email",
          value: "user1@example.com"
        }
      };
      const event_password = {
        target: {
          name: "password",
          value: "abc"
        }
      };

      wrapper
        .find(Input)
        .at(0)
        .simulate("change", event_email);
      wrapper
        .find(Input)
        .at(1)
        .simulate("change", event_password);

      wrapper
        .find("form")
        .at(0)
        .simulate("submit", fakeEvent);

      spyon.mockClear();
      spyon2.mockClear();
    });
  });

  describe("null case with other authState", () => {
    test("render corrently", () => {
      const wrapper = shallow(<MySignIn />);

      for (let i = 0; i < deniedStates.length; i += 1) {
        wrapper.setProps({
          authState: deniedStates[i]
        });

        expect(wrapper).toMatchSnapshot();
      }
    });
  });

  describe("sign in test", () => {
    test("UserNotConfirmedException, change state to confirmSignUp", async () => {
      const wrapper = shallow(<MySignIn />);
      const signIn = wrapper.instance();

      const spyon = jest.spyOn(Auth, "signIn").mockImplementationOnce(() => {
        return Promise.reject({
          code: "UserNotConfirmedException"
        });
      });

      const spyon2 = jest.spyOn(signIn, "changeState");
      await signIn.signIn(fakeEvent);

      spyon.mockClear();
      spyon2.mockClear();
    });
  });
});

// describe('SignIn', () => {
//   it("should handleSubmit success", async () => {
//     const props = {
//       signIn: jest.fn(() => Promise.resolve),
//       loadUserIfLoggedIn: jest.fn(() => Promise.resolve())
//     };
//     const state = {
//My       email: "tziegler@whitehouse.gov",
//       password: "andrea"
//     };
//       preventDefault: jest.fn()
//     };
//     const signInComponent = shallow(<MySignIn {...props} />);
//     const instance = signInComponent.instance();
//     instance.setState(state);
//     await instance.handleSubmit(event);
//     expect(instance.state.errorMessage).toEqual("");
//     expect(props.loadUserIfLoggedIn.mock.calls.length).toEqual(1);
//     expect(event.preventDefault.mock.calls.length).toEqual(1);
//     expect(instance.state.loading).toBeFalsy();
//   });
//   it("should handleSubmit failure", async () => {
//     const err = {
//       code: "UserNotFoundException"
//     };
//     const props = {
//       signIn: jest.fn(() => Promise.reject(err)),
//       loadUserIfLoggedIn: jest.fn(() => Promise.resolve())
//     };
//     const state = {
//       email: "tziegler@whitehouse.gov",
//       password: "andrea"
//     };
//     const event = {
//       preventDefault: jest.fn()
//     };
//     const signInComponent = shallow(<MySignIn {...props} />);
//     const instance = signInComponent.instance();
//     instance.setState(state);
//     await instance.handleSubmit(event);
//     expect(props.loadUserIfLoggedIn.mock.calls.length).toEqual(0);
//     expect(event.preventDefault.mock.calls.length).toEqual(1);
//     expect(instance.state.errorMessage).toEqual("That user does not exist");
//     expect(instance.state.loading).toBeFalsy();
//   });
//   it("should handleChange to state", () => {
//     const event = {
//       target: {
//         id: "email",
//         value: "sseaborn@whitehouse.gov"
//       }
//     };
//     const signInComponent = shallow(<MySignIn />);
//     const instance = signInComponent.instance();
//     instance.handleChange(event);
//     expect(instance.state.email).toEqual(event.target.value);
//   });
// });
