const mongoose = require( "mongoose" );
const crypt = require( "bcrypt" );

const schemaUser = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(value) {
          return /^[a-zA-Z0-9]([_-](?![_-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/.test(
            value
          )
        },
        message: 'Login is bad.',
      },
    },
    name: {
      type: String,
      required: true,
      maxLength: 25,
    },
    surname: {
      type: String,
      required: true,
      maxLength: 40,
    },
    password: {
      type: String,
      validate: {
        validator(value) {
          return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{8,})/.test(value)
        },
        message: 'Password id bad.',
      },
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: ['user', 'admin', 'deleted'],
      default: 'user',
    },
  },
  {
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
      virtuals: true,
    },
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
      virtuals: true,
    },
  }
)

schemaUser.virtual('activities', {
  ref: 'Activity',
  localField: '_id',
  foreignField: 'user',
})

schemaUser.pre( "save", function ( next ) {
	const user = this;

	crypt.hash( user.password, 10, function ( err, hash ) {
		if ( err ) return next( err );
		user.password = hash;
		return next();
	} );
} );

schemaUser.pre( "updateOne", function ( next ) {
	const user = this.getUpdate();

	if( user.password ){
		crypt.hash( user.password, 10, function ( err, hash ) {
			if ( err ) return next( err );
			user.password = hash;
			return next();
		} );
	}else{
		return next();
	}
} );


const User = mongoose.model( "User", schemaUser );

module.exports = User;
