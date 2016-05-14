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

package io.cfp.controller;

import io.cfp.domain.exception.NotVerifiedException;
import io.cfp.dto.RestrictedMeter;
import io.cfp.entity.Role;
import io.cfp.entity.User;
import io.cfp.service.TalkUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = { "/v0/stats", "/api/stats" }, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class StatsController extends RestrictedController {

    @Autowired
    private TalkUserService talkService;

    @RequestMapping("/meter")
    @Secured(Role.AUTHENTICATED)
    public RestrictedMeter meter(HttpServletRequest req) throws NotVerifiedException {
        User user = retrieveUser(req);

        RestrictedMeter res = new RestrictedMeter();
        res.setTalks(talkService.count(user.getId()));
        return res;
    }

}
