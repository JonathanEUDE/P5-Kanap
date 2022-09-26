// fonction permettant de retourner l'URL du Serveur NodeJS (back). 
// Celle-ci est centralisée pour ne changer l'information qu'à un seul endroit.
// Dans les fichiers où l'on souhaite utiliser cette fonction, il faudra écrire en tête du fichier :
// import {getServerUrl} from './parameter.js';
function getServerUrl()
{
    const SERVER_URL = "http://localhost:3000/"
    return SERVER_URL;
}