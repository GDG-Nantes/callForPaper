/*
 * Copyright (c) 2016 BreizhCamp
 * [http://breizhcamp.org]
 *
 * This file is part of CFP.io.
 *
 * CFP.io is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

package io.cfp.config.filter;

import io.cfp.domain.common.UserAuthentication;
import io.cfp.entity.Event;
import io.cfp.entity.Role;
import io.cfp.entity.User;
import io.cfp.repository.RoleRepository;
import io.cfp.service.auth.AuthUtils;
import io.cfp.service.auth.AuthUtils.InvalidTokenException;
import org.apache.log4j.MDC;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Filter reading auth token (JWT) to verify if user is correctly logged
 */
public class AuthFilter implements Filter {

    protected static final String USER = "user";

    private AuthUtils authUtils;
    private RoleRepository roleRepository;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        ServletContext servletContext = filterConfig.getServletContext();
        WebApplicationContext webApplicationContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);
        authUtils = webApplicationContext.getBean(AuthUtils.class);
        roleRepository = webApplicationContext.getBean(RoleRepository.class);
    }

    /**
     * Do Auth filter according to JWT token
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        try {
            User user = authUtils.getAuthUser(httpRequest);
            MDC.put(USER, user);

            List<Role> roles = roleRepository.findByUserIdAndEventId(user.getId(), Event.current());

            UserAuthentication authentication = new UserAuthentication(user, roles);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            chain.doFilter(request, response);

        } catch (InvalidTokenException e) {
            httpResponse.sendError(e.getResponseCode(), e.getMessage());
        }
        finally {
            MDC.remove(USER);
            SecurityContextHolder.getContext().setAuthentication(null);
        }
    }

    @Override
    public void destroy() { /* unused */ }

}
