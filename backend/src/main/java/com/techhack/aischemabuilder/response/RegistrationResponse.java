package com.techhack.aischemabuilder.response;

public class RegistrationResponse {

    private boolean success;

    public RegistrationResponse(
        boolean success
    ) {
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }

}
