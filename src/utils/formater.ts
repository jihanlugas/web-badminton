import moment from 'moment';

export const displayDate = (value, format = 'DD MMM YYYY') => {
	if (value != null) {
		return moment(value).format(format);
	} else {
		return '';
	}
};

export const displayTIme = (value, format = 'HH:mm') => {
	if (value != null) {
		return moment(value).format(format);
	} else {
		return '';
	}
};

export const displayDateTime = (value, format = 'DD MMM YYYY HH:mm') => {
	if (value != null) {
		return moment(value).format(format);
	} else {
		return '';
	}
};

export const displayDateForm = (value) => {
	if (value != null) {
		return moment(value).format('YYYY-MM-DDTHH:mm:ss');
	} else {
		return '';
	}
};

export const displayActive = (val: boolean): string => {
	return val ? 'Active' : 'Not Active';
};


export const displayPhoneNumber = (value: string): string => {
	var cleaned = ('' + value).replace(/\D/g, '');
	var match = cleaned.match(/^(62|)?(\d{3})(\d{4})(\d{3,6})$/);
	if (match) {
		var intlCode = (match[1] ? '+62 ' : '');
		return [intlCode, ' ', match[2], '-', match[3], '-', match[4]].join('');
	}
	return value;
}

export const displayNumber = (value: number, locales: string = 'in-ID'): string => {
	const numberFormatter = Intl.NumberFormat(locales);
	return numberFormatter.format(value);
}

export const displayMoney = (value: number, locales: string = 'in-ID'): string => {
	return 'Rp ' + displayNumber(value);
}