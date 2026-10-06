// Identity lifecycle hooks: give every new account the default "member" role
export default {
  userSignup(event) {
    return {
      user: {
        ...event.user,
        appMetadata: {
          ...event.user.appMetadata,
          roles: ["member"],
        },
      },
    };
  },
};
