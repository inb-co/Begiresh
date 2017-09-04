export const track = ({category ,action, label}) => {

    if(ga){
        ga('send', {
            hitType: 'event',
            eventCategory: category,
            eventAction: action,
            eventLabel: label
        });
    }

}