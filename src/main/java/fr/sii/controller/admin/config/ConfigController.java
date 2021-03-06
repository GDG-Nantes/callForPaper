package fr.sii.controller.admin.config;

import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Key;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.validation.Valid;


/**
 * Created by tmaugin on 16/07/2015.
 * SII
 */
@Controller
@RequestMapping(value="api/admin/config", produces = "application/json; charset=utf-8")
public class ConfigController {

    /**
     * Disable or enable submission of new talks
     * @param key enable submission if true, else disable
     * @return key
     */
    @RequestMapping(value="/enableSubmissions", method= RequestMethod.POST)
    @ResponseBody
    public fr.sii.domain.common.Key postEnableSubmissions(@Valid @RequestBody fr.sii.domain.common.Key key) {
        Key applicationConfigKey = KeyFactory.createKey("Config", "Application");
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Entity config = new Entity(applicationConfigKey);
        config.setProperty("enableSubmissions", key.getKey().toLowerCase().equals("true"));
        datastore.put(config);
        return key;
    }
}