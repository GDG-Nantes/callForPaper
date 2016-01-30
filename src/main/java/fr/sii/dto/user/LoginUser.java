package fr.sii.dto.user;

import javax.validation.constraints.NotNull;

/**
 * Created by tmaugin on 18/05/2015.
 */
public class LoginUser {

    @NotNull(message = "Email field is required")
    private String email;
    @NotNull(message = "Password field is required")
    private String password;

    public LoginUser(String email, String password, String captcha) {
        this.email = email;
        this.password = password;
    }

    public LoginUser() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
