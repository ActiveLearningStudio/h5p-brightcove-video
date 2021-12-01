const brightcoveAPIBasePath = 'https://cms.api.brightcove.com';
const brightcoveAccountId = '6282550302001';

const BrightcoveAPISetting = {
    grantType: 'client_credentials',
    clientId: 'ba458ab6-ec97-4a7c-a0da-854427823722',
    clientSecret: 'ohYIarN4dT3YGP-beI2gB_CX2juT3FeDxXLiVFr8b5tuD1XUhcouecv4FdOOYkCewRF1zCdi6dxM5TQs4DW4zQ',
    apiPath:{
        getToken : 'https://oauth.brightcove.com/v4/access_token',
        getVideoListAndSearch : brightcoveAPIBasePath+'/v1/accounts/'+brightcoveAccountId+'/videos'
    }
}