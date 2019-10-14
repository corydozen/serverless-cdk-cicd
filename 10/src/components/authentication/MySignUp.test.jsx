import Auth from "@aws-amplify/auth";
import MySignUp from "./MySignUp";
import * as React from "react";
import AuthPiece from "aws-amplify-react/dist/Auth/AuthPiece";
import {
    Link,
    Header,
    Footer,
    Input,
    Button,
    SelectInput,
    InputLabel
} from "aws-amplify-react/dist/Amplify-UI/Amplify-UI-Components-React";
import { PhoneField } from "aws-amplify-react/dist/Auth/PhoneField";

const acceptedStates = ["signUp", "confirmSignUp"];

const deniedStates = [
    "signIn",
    "signedUp",
    "signedOut",
    "forgotPassword",
    "signedIn",
    "verifyContact"
];

const mockResult = {
    user: {
        username: "testuser"
    }
};

const props = {
    signUpConfig: {
        hiddenDefaults: ["phone_number", "username"],
        signUpFields: [
            {
                label: "Email",
                key: "email",
                required: true,
                displayOrder: 1,
                type: "string"
            },
            {
                label: "Password",
                key: "password",
                required: true,
                displayOrder: 2,
                type: "password"
            },
            {
                label: "First Name",
                key: "first_name",
                required: true,
                displayOrder: 3,
                type: "string",
                custom: true
            },
            {
                label: "Last Name",
                key: "last_name",
                required: true,
                displayOrder: 3,
                type: "string",
                custom: true
            }
        ]
    }
};

describe("signUp without signUpConfig prop", () => {
    describe("normal case", () => {
        const wrapper = shallow(<MySignUp {...props} />);

        test("render correctly with authState signUp", () => {
            for (let i = 0; i < acceptedStates.length; i += 1) {
                wrapper.setProps({
                    authState: acceptedStates[i]
                });
                expect(wrapper).toMatchSnapshot();
            }
        });

        test("render correctly with hide", () => {
            for (let i = 0; i < acceptedStates.length; i += 1) {
                wrapper.setProps({
                    authState: acceptedStates[i],
                    hide: [MySignUp]
                });
                expect(wrapper).toMatchSnapshot();
            }
        });

        test("when clicking signUp", async () => {
            const wrapper = shallow(<MySignUp {...props} />);
            wrapper.setProps({
                authState: "signUp"
            });

            const spyon = jest
                .spyOn(Auth, "signUp")
                .mockImplementationOnce((user, password) => {
                    return new Promise((res, rej) => {
                        res(mockResult);
                    });
                });

            const spyon_changeState = jest.spyOn(
                wrapper.instance(),
                "changeState"
            );

            const event_password = {
                target: {
                    name: "password",
                    value: "abc"
                }
            };

            const event_email = {
                target: {
                    name: "email",
                    value: "email@amazon.com"
                }
            };

            const event_first_name = {
                target: {
                    name: "first_name",
                    value: "Jane"
                }
            };

            const event_last_name = {
                target: {
                    name: "last_name",
                    value: "Doe"
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
                .find(Input)
                .at(2)
                .simulate("change", event_first_name);
            wrapper
                .find(Input)
                .at(3)
                .simulate("change", event_last_name);

            await wrapper.find(Button).simulate("click");

            expect(spyon).toBeCalledWith({
                attributes: {
                    email: "email@amazon.com",
                    "custom:first_name": "Jane",
                    "custom:last_name": "Doe"
                },
                password: "abc",
                username: "email@amazon.com"
            });
            expect(spyon_changeState).toBeCalled();
            expect(spyon_changeState.mock.calls[0][0]).toBe("confirmSignUp");

            spyon.mockClear();
            spyon_changeState.mockClear();
        });
    });

    describe("null case with other authState", () => {
        test("render corrently", () => {
            const wrapper = shallow(<MySignUp {...props} />);

            for (let i = 0; i < deniedStates.length; i += 1) {
                wrapper.setProps({
                    authState: deniedStates[i]
                });

                expect(wrapper).toMatchSnapshot();
            }
        });
    });
});

describe("signUp with signUpConfig", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<MySignUp {...props} />);
    });

    test("render correctly with authState signUp", () => {
        for (var i = 0; i < acceptedStates.length; i += 1) {
            wrapper.setProps({
                authState: acceptedStates[i],
                signUpConfig: {
                    signUpFields: [
                        {
                            key: "address",
                            label: "Address",
                            required: true
                        }
                    ]
                }
            });
            expect(wrapper).toMatchSnapshot();
        }
    });

    test("render correctly with hide", () => {
        for (var i = 0; i < acceptedStates.length; i += 1) {
            wrapper.setProps({
                authState: acceptedStates[i],
                hide: [MySignUp],
                signUpConfig: {
                    signUpFields: [
                        {
                            key: "address",
                            label: "Address",
                            required: true
                        }
                    ]
                }
            });
            expect(wrapper).toMatchSnapshot();
        }
    });

    test("expect custom field to be last if display order not defined", () => {
        wrapper.setProps({
            authState: "signUp",
            signUpConfig: {
                signUpFields: [
                    {
                        key: "address",
                        label: "Address",
                        required: true
                    }
                ]
            }
        });
        const addressElementFound = wrapper.find({ name: "address" });
        const addressChildFound = wrapper.find(Input).at(3);
        expect(addressElementFound.props().name).toEqual(
            addressChildFound.props().name
        );
    });

    test("expect custom field to be first if display order is defined as 1, and it is prior to username alpabetically", () => {
        wrapper.setProps({
            authState: "signUp",
            signUpConfig: {
                signUpFields: [
                    {
                        key: "address",
                        label: "Address",
                        required: true,
                        displayOrder: 1
                    }
                ]
            }
        });
        const addressElementFound = wrapper.find({ name: "address" });
        const addressChildFound = wrapper.find(Input).at(0);
        expect(addressElementFound.props().name).toEqual(
            addressChildFound.props().name
        );
    });

    test("expect custom field to be second if display order is defined as 1, and it is after username alpabetically", () => {
        wrapper.setProps({
            authState: "signUp",
            signUpConfig: {
                signUpFields: [
                    {
                        key: "z",
                        label: "Z",
                        required: true,
                        displayOrder: 1
                    }
                ]
            }
        });
        const addressElementFound = wrapper.find({ name: "z" });
        const addressChildFound = wrapper.find(Input).at(1);
        expect(addressElementFound.props().name).toEqual(
            addressChildFound.props().name
        );
    });

    test("expect 5 fields to be present if hideAllDefaults is undefined", () => {
        wrapper.setProps({
            authState: "signUp",
            signUpConfig: {
                signUpFields: [
                    {
                        key: "z",
                        label: "Z",
                        required: true,
                        displayOrder: 1
                    }
                ]
            }
        });
        expect(wrapper.find(Input).length).toEqual(4);
        expect(wrapper.find(PhoneField).length).toEqual(1);
    });

    test("expect 5 fields to be present if hideAllDefaults is false", () => {
        wrapper.setProps({
            authState: "signUp",
            signUpConfig: {
                hideAllDefaults: false,
                signUpFields: [
                    {
                        key: "z",
                        label: "Z",
                        required: true,
                        displayOrder: 1
                    }
                ]
            }
        });
        expect(wrapper.find(Input).length).toEqual(4);
        expect(wrapper.find(PhoneField).length).toEqual(1);
    });

    test("expect custom field to be the only field if hideAllDefaults is true", () => {
        wrapper.setProps({
            authState: "signUp",
            signUpConfig: {
                hideAllDefaults: true,
                signUpFields: [
                    {
                        key: "z",
                        label: "Z",
                        required: true,
                        displayOrder: 1
                    }
                ]
            }
        });
        expect(wrapper.find(Input).length).toEqual(1);
    });

    test("expect default username to be overwritten if username field passed in via signUpConfig", () => {
        wrapper.setProps({
            authState: "signUp",
            signUpConfig: {
                signUpFields: [
                    {
                        key: "z",
                        label: "Z",
                        required: true
                    },
                    {
                        key: "username",
                        label: "NEW USERNAME LABEL",
                        required: true
                    }
                ]
            }
        });

        const signup = new MySignUp();
        const defaultUsernameLabel = signup.defaultSignUpFields.find(i => {
            return i.key === "username";
        }).label;

        const customUsername = wrapper.find(InputLabel).findWhere(el => {
            return el.text() === "NEW USERNAME LABEL";
        });

        const originalUsername = wrapper.find(InputLabel).findWhere(el => {
            return el.text() === defaultUsernameLabel;
        });

        expect(customUsername.length).toEqual(1);
        expect(originalUsername.length).toEqual(0);
    });

    test("default dial code should be set to passed defaultCountryCode", () => {
        wrapper.setProps({
            authState: "signUp",
            signUpConfig: {
                defaultCountryCode: "51",
                signUpFields: [
                    {
                        key: "z",
                        label: "Z",
                        required: true
                    },
                    {
                        key: "username",
                        label: "NEW USERNAME LABEL",
                        required: true
                    }
                ]
            }
        });

        let phoneField = wrapper.find(PhoneField).at(0);
        expect(phoneField.props().defaultDialCode).toEqual("+51");
    });

    test("signUp should not complete if required field is not filled out", async () => {
        wrapper.setProps({
            authState: "signUp",
            signUpConfig: {
                defaultCountryCode: "51",
                signUpFields: [
                    {
                        key: "z",
                        label: "Z",
                        required: true
                    },
                    {
                        key: "username",
                        label: "NEW USERNAME LABEL",
                        required: true
                    }
                ]
            }
        });

        const spyon = jest
            .spyOn(Auth, "signUp")
            .mockImplementationOnce((user, password) => {
                return new Promise((res, rej) => {
                    res(mockResult);
                });
            });

        const spyon_changeState = jest.spyOn(wrapper.instance(), "changeState");

        const event_username = {
            target: {
                name: "username",
                value: "user1"
            }
        };
        const event_password = {
            target: {
                name: "password",
                value: "abc"
            }
        };

        const event_email = {
            target: {
                name: "email",
                value: "email@amazon.com"
            }
        };
        const event_phone = {
            target: {
                name: "phone_line_number",
                value: "2345678999"
            }
        };
        const dial_code = {
            target: {
                name: "dial_code",
                value: "+1"
            }
        };

        wrapper
            .find(Input)
            .at(0)
            .simulate("change", event_username);
        wrapper
            .find(Input)
            .at(1)
            .simulate("change", event_password);
        wrapper
            .find(Input)
            .at(2)
            .simulate("change", event_email);
        wrapper
            .find(Input)
            .at(3)
            .simulate("change", event_phone);
        await wrapper.find(Button).simulate("click");

        expect(spyon).not.toBeCalled();
    });

    test("signUp should  complete if optional field is not filled out", async () => {
        wrapper.setProps({
            authState: "signUp",
            signUpConfig: {
                defaultCountryCode: "51",
                signUpFields: [
                    {
                        key: "z",
                        label: "Z",
                        required: false
                    },
                    {
                        key: "username",
                        label: "NEW USERNAME LABEL",
                        required: true
                    }
                ]
            }
        });

        const spyon = jest
            .spyOn(Auth, "signUp")
            .mockImplementationOnce((user, password) => {
                return new Promise((res, rej) => {
                    res(mockResult);
                });
            });

        const spyon_changeState = jest.spyOn(wrapper.instance(), "changeState");

        const event_username = {
            target: {
                name: "username",
                value: "user1"
            }
        };
        const event_password = {
            target: {
                name: "password",
                value: "abc"
            }
        };

        const event_email = {
            target: {
                name: "email",
                value: "email@amazon.com"
            }
        };
        const phone_number = "+12345678999";

        wrapper
            .find(Input)
            .at(0)
            .simulate("change", event_username);
        wrapper
            .find(Input)
            .at(1)
            .simulate("change", event_password);
        wrapper
            .find(Input)
            .at(2)
            .simulate("change", event_email);
        wrapper
            .find(PhoneField)
            .at(0)
            .simulate("changeText", phone_number);
        await wrapper.find(Button).simulate("click");

        expect(spyon).toBeCalled();
    });

    test("signUp should  complete if required field is filled out", async () => {
        wrapper.setProps({
            authState: "signUp",
            signUpConfig: {
                defaultCountryCode: "51",
                signUpFields: [
                    {
                        key: "z",
                        label: "Z",
                        required: true
                    },
                    {
                        key: "username",
                        label: "NEW USERNAME LABEL",
                        required: true
                    }
                ]
            }
        });

        const spyon = jest
            .spyOn(Auth, "signUp")
            .mockImplementationOnce((user, password) => {
                return new Promise((res, rej) => {
                    res(mockResult);
                });
            });

        const spyon_changeState = jest.spyOn(wrapper.instance(), "changeState");

        const event_username = {
            target: {
                name: "username",
                value: "user1"
            }
        };
        const event_password = {
            target: {
                name: "password",
                value: "abc"
            }
        };

        const event_email = {
            target: {
                name: "email",
                value: "email@amazon.com"
            }
        };
        const phone_number = "+12345678999";
        const event_z = {
            target: {
                name: "z",
                value: "1"
            }
        };

        wrapper
            .find(Input)
            .at(0)
            .simulate("change", event_username);
        wrapper
            .find(Input)
            .at(1)
            .simulate("change", event_password);
        wrapper
            .find(Input)
            .at(2)
            .simulate("change", event_email);
        wrapper
            .find(PhoneField)
            .at(0)
            .simulate("changeText", phone_number);
        wrapper
            .find(Input)
            .at(3)
            .simulate("change", event_z);
        await wrapper.find(Button).simulate("click");

        expect(spyon).toBeCalled();
    });

    test("signUp should complete even if phone field is hidden", async () => {
        wrapper.setProps({
            authState: "signUp",
            signUpConfig: {
                hiddenDefaults: ["phone_number"]
            }
        });

        const spyon = jest
            .spyOn(Auth, "signUp")
            .mockImplementationOnce((user, password) => {
                return new Promise((res, rej) => {
                    res(mockResult);
                });
            });

        const event_username = {
            target: {
                name: "username",
                value: "user1"
            }
        };

        const event_password = {
            target: {
                name: "password",
                value: "abc"
            }
        };

        const event_email = {
            target: {
                name: "email",
                value: "email@amazon.com"
            }
        };

        wrapper
            .find(Input)
            .at(0)
            .simulate("change", event_username);
        wrapper
            .find(Input)
            .at(1)
            .simulate("change", event_password);
        wrapper
            .find(Input)
            .at(2)
            .simulate("change", event_email);
        await wrapper.find(Button).simulate("click");

        expect(spyon).toBeCalled();
    });
});

describe("ConfirmSignIn", () => {
    describe("normal case", () => {
        test("render correctly with Props confirmSignUp", () => {
            const wrapper = shallow(<MySignUp {...props} />);
            for (let i = 0; i < acceptedStates.length; i += 1) {
                wrapper.setProps({
                    authState: acceptedStates[i]
                });
                expect(wrapper).toMatchSnapshot();
            }
        });

        test("render correctly with hide", () => {
            const wrapper = shallow(<MySignUp {...props} />);
            for (let i = 0; i < acceptedStates.length; i += 1) {
                wrapper.setProps({
                    authState: acceptedStates[i],
                    hide: [MySignUp]
                });
                expect(wrapper).toMatchSnapshot();
            }
        });

        test("simulate clicking confirm button with username already defined in auth data signs user in", async () => {
            const spyon = jest
                .spyOn(Auth, "confirmSignUp")
                .mockImplementation((user, code) => {
                    return new Promise((res, rej) => {
                        res();
                    });
                });

            const spyon3 = jest
                .spyOn(MySignUp.prototype, "usernameFromAuthData")
                .mockImplementation(() => {
                    return "user@amazon.com";
                });

            const wrapper = shallow(<MySignUp {...props} />);
            const spyon2 = jest.spyOn(wrapper.instance(), "changeState");
            const spyon4 = jest
                .spyOn(Auth, "signIn")
                .mockImplementationOnce((user, password) => {
                    return new Promise((res, rej) => {
                        res({
                            Session: null
                        });
                    });
                });
            wrapper.setProps({
                authState: acceptedStates[1],
                hide: false
            });

            wrapper.setState({ password: "abc", email: "user@amazon.com" });

            const event_code = {
                target: {
                    name: "code",
                    value: "123456"
                }
            };

            wrapper
                .find(Input)
                .at(0)
                .simulate("change", event_code);
            await wrapper
                .find(Button)
                .at(0)
                .simulate("click");

            expect.assertions(2);
            expect(spyon).toBeCalledWith("user@amazon.com", "123456");
            expect(spyon4).toBeCalledWith("user@amazon.com", "abc");

            spyon.mockClear();
            spyon2.mockClear();
            spyon3.mockClear();
            spyon4.mockClear();
        });

        test("simulate clicking resend button with username already defined in auth data", async () => {
            const spyon = jest
                .spyOn(Auth, "resendSignUp")
                .mockImplementation(user => {
                    return new Promise((res, rej) => {
                        res();
                    });
                });

            const spyon3 = jest
                .spyOn(MySignUp.prototype, "usernameFromAuthData")
                .mockImplementation(() => {
                    return "user";
                });

            const wrapper = shallow(<MySignUp {...props} />);

            wrapper.setProps({
                authState: acceptedStates[1],
                hide: false
            });

            const event_code = {
                target: {
                    name: "code",
                    value: "123456"
                }
            };

            const event_username = {
                target: {
                    name: "username",
                    value: "user1"
                }
            };

            await wrapper
                .find(Link)
                .at(0)
                .simulate("click");

            expect.assertions(1);
            expect(spyon).toBeCalledWith("user");

            spyon.mockClear();
        });
    });

    describe("null case with other authState", () => {
        test("render corrently", () => {
            const wrapper = shallow(<MySignUp {...props} />);

            for (let i = 0; i < deniedStates.length; i += 1) {
                wrapper.setProps({
                    authState: deniedStates[i]
                });

                expect(wrapper).toMatchSnapshot();
            }
        });
    });
});
