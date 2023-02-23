var personne = {
    nom: ['Jean', 'Martin'],
    age: 32,
    sexe: 'masculin',
    interets: ['musique', 'skier'],
    bio: function() {
      alert(this.nom[0] + ' ' + this.nom[1] + ' a ' + this.age + ' ans. Il aime ' + this.interets[0] + ' et ' + this.interets[1] + '.');
    },
    salutation: function() {
      alert('Bonjour ! Je suis ' + this.nom[0] + '.');
    }
  };
  