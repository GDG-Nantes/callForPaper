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

package io.cfp.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
@Accessors(chain = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Proposal {

    public enum State { DRAFT, CONFIRMED, ACCEPTED, REFUSED, BACKUP }

    private int id;
    @NotNull
    private State state;
    @NotNull(message = "Session name field is required")
    private String name;
    private String language;
    private String eventId;
    private Integer trackId;
    private String trackLabel;
    private String description;
    private String references;
    private Integer difficulty;
    private Date added;
    private Integer formatId;
    @NotNull(message = "Speaker field is required")
    private User speaker;

    private Date schedule;
    private Integer roomId;

    private Set<User> cospeakers;

    private String video;
    private String slides;

}